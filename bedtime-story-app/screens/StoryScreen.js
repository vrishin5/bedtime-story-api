import React, { useState } from "react";
import { View, Text, ScrollView, Button, StyleSheet, ActivityIndicator } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { encode } from "base64-arraybuffer"; // ✅ new import

const BASE_URL = "https://bedtime-story-api-tdhc.onrender.com"; // your deployed backend

export default function StoryScreen({ route, navigation }) {
  const { story } = route.params;
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  const playAudio = async () => {
    try {
      setLoading(true);

      // Fetch audio from backend as binary
      const res = await axios.post(
        `${BASE_URL}/tts`,
        { story_text: story },
        { responseType: "arraybuffer" }
      );

      // ✅ Convert ArrayBuffer to base64 using base64-arraybuffer
      const base64Audio = encode(res.data);

      // Save audio to temporary file
      const fileUri = FileSystem.cacheDirectory + "story.mp3";
      await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Load and play the saved file
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: fileUri });
      setSound(newSound);
      setLoading(false);
      setPlaying(true);

      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlaying(false);
        }
      });
    } catch (err) {
      setLoading(false);
      console.error("Error playing audio:", err);
      alert("Unable to generate or play audio right now.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Your Bedtime Story</Text>

      {/* 🎧 Audio button at the top */}
      <View style={styles.audioButtonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6C63FF" />
        ) : (
          <Button
            title={playing ? "⏸️ Playing..." : "🎧 Listen to Story"}
            onPress={playAudio}
            disabled={playing}
            color="#6C63FF"
          />
        )}
      </View>

      {/* Story text below */}
      <ScrollView style={styles.storyContainer}>
        <Text style={styles.storyText}>{story}</Text>
      </ScrollView>

      {/* Back button at the bottom */}
      <View style={styles.backButton}>
        <Button title="🔙 Back to Home" onPress={() => navigation.navigate("Home")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  audioButtonContainer: { alignItems: "center", marginBottom: 15 },
  storyContainer: { flex: 1, marginBottom: 20 },
  storyText: { fontSize: 16, lineHeight: 24, color: "#333" },
  backButton: { marginBottom: 20 },
});
