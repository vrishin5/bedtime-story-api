import React, { useState } from "react";
import { View, Text, ScrollView, Button, StyleSheet, ActivityIndicator } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import axios from "axios";
import { encode } from "base64-arraybuffer";

const BASE_URL = "https://bedtime-story-api-tdhc.onrender.com";

export default function StoryScreen({ route, navigation }) {
  const { story } = route.params;
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  // ⭐ NEW: Save audio file so we don't fetch again
  const [audioUri, setAudioUri] = useState(null);

  const playOrPauseAudio = async () => {
    try {
      // ⭐ If we already have an audio file, skip the API call
      if (audioUri && !sound) {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri });
        setSound(newSound);
        setPlaying(true);
        await newSound.playAsync();
        return;
      }

      // ⭐ If sound exists (pause/resume logic)
      if (sound) {
        if (playing && !paused) {
          await sound.pauseAsync();
          setPaused(true);
          return;
        } else if (paused) {
          await sound.playAsync();
          setPaused(false);
          return;
        }
      }

      setLoading(true);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      let fileUri = audioUri;

      // ⭐ If we don't have audio saved yet, fetch it ONCE
      if (!fileUri) {
        const res = await axios.post(
          `${BASE_URL}/tts`,
          { story_text: story },
          { responseType: "arraybuffer" }
        );

        const base64Audio = encode(res.data);

        fileUri = FileSystem.cacheDirectory + "story.mp3";
        await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // ⭐ Save file path so next play is instant
        setAudioUri(fileUri);
      }

      // Load and play local file
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: fileUri });
      setSound(newSound);
      setPlaying(true);
      setPaused(false);
      setLoading(false);

      await newSound.playAsync();

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlaying(false);
          setPaused(false);
        }
      });
    } catch (err) {
      setLoading(false);
      console.error("Error playing audio:", err);
      alert("Unable to play audio.");
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setPlaying(false);
      setPaused(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>📖 Your Bedtime Story</Text>

      <View style={{ alignItems: "center", marginBottom: 15 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#6C63FF" />
        ) : (
          <>
            <Button
              title={
                playing
                  ? paused
                    ? "▶️ Resume Story"
                    : "⏸️ Pause Story"
                  : "🎧 Listen to Story"
              }
              onPress={playOrPauseAudio}
              color="#6C63FF"
            />

            {playing && (
              <View style={{ marginTop: 10 }}>
                <Button title="⏹️ Stop" onPress={stopAudio} color="#E57373" />
              </View>
            )}
          </>
        )}
      </View>

      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.storyText}>{story}</Text>
      </ScrollView>

      <View style={{ marginBottom: 20 }}>
        <Button title="🔙 Back to Home" onPress={() => navigation.navigate("Home")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { textAlign: "center", fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  storyText: { fontSize: 16, lineHeight: 24, color: "#333" },
});
