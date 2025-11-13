import React, { useState } from "react";
import { View, Text, ScrollView, Button, StyleSheet, ActivityIndicator } from "react-native";
import { Audio } from "expo-av";
import axios from "axios";

const BASE_URL = "https://bedtime-story-api-tdhc.onrender.com"; // your deployed backend

export default function StoryScreen({ route, navigation }) {
  const { story } = route.params;
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Fetch and play audio from your FastAPI /tts endpoint
  const playAudio = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/tts`,
        { story_text: story },
        { responseType: "arraybuffer" }
      );

      // Convert binary data to a playable audio file
      const blob = new Blob([res.data], { type: "audio/mpeg" });
      const soundObj = new Audio.Sound();
      const audioUri = URL.createObjectURL(blob);

      await soundObj.loadAsync({ uri: audioUri });
      setSound(soundObj);
      setLoading(false);
      setPlaying(true);
      await soundObj.playAsync();

      soundObj.setOnPlaybackStatusUpdate((status) => {
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
  audioButtonContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  storyContainer: {
    flex: 1,
    marginBottom: 20,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  backButton: {
    marginBottom: 20,
  },
});
