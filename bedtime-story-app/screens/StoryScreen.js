import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Button, StyleSheet, ActivityIndicator, Animated } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import axios from "axios";
import { encode } from "base64-arraybuffer";
import Background from "../components/Background";
import { colors, typography } from "./theme";

const BASE_URL = "https://bedtime-story-api-tdhc.onrender.com";

export default function StoryScreen({ route, navigation }) {
  const { story } = route.params;
  const [sound, setSound] = useState(null);
  const [bgSound, setBgSound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  // Fade-in story text
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  // Ambient background loop
  useEffect(() => {
    (async () => {
      try {
        const { sound: s } = await Audio.Sound.createAsync(
          require("../assets/audio/night_ambience.mp3"),
          { isLooping: true, volume: 0.15 }
        );
        setBgSound(s);
        await s.playAsync();
      } catch {}
    })();
    return () => { bgSound?.unloadAsync(); sound?.unloadAsync(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playOrPauseAudio = async () => {
    try {
      if (sound) {
        if (playing && !paused) { await sound.pauseAsync(); setPaused(true); return; }
        if (paused) { await sound.playAsync(); setPaused(false); return; }
      }

      setLoading(true);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const res = await axios.post(`${BASE_URL}/tts`, { story_text: story }, { responseType: "arraybuffer" });
      const base64Audio = encode(res.data);

      const fileUri = FileSystem.cacheDirectory + "story.mp3";
      await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: fileUri }, { volume: 0.95 });
      setSound(newSound);
      setLoading(false);
      setPlaying(true);
      setPaused(false);

      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) { setPlaying(false); setPaused(false); }
      });
    } catch (err) {
      setLoading(false);
      console.error("Error playing audio:", err);
      alert("Unable to generate or play audio right now.");
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
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>📖 Your Bedtime Story</Text>

        <View style={styles.audioRow}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <Button
                title={playing ? (paused ? "▶️ Resume Story" : "⏸️ Pause Story") : "🎧 Listen to Story"}
                onPress={playOrPauseAudio}
                color={colors.primary}
              />
              {playing && (
                <View style={{ marginTop: 10 }}>
                  <Button title="⏹️ Stop" onPress={stopAudio} color="#E57373" />
                </View>
              )}
            </>
          )}
        </View>

        <Animated.View style={{ flex: 1, opacity: fade }}>
          <ScrollView contentContainerStyle={styles.storyWrap}>
            <Text style={styles.storyText}>{story}</Text>
          </ScrollView>
        </Animated.View>

        <View style={{ marginBottom: 12 }}>
          <Button title="🔙 Back to Home" onPress={() => navigation.navigate("Home")} />
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  title: {
    color: colors.text, fontSize: typography.h1, fontWeight: "700",
    textAlign: "center", marginBottom: 8
  },
  audioRow: { alignItems: "center", marginBottom: 12 },
  storyWrap: { paddingBottom: 28 },
  storyText: {
    color: colors.text, fontSize: typography.body, lineHeight: typography.lineHeight + 4,
    backgroundColor: colors.card, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: colors.border
  },
});
