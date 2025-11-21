import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import Background from "../components/Background";
import { colors, typography } from "./theme";

const BASE_URL = "https://bedtime-story-api-tdhc.onrender.com";

export default function StoryScreen({ route, navigation }) {
  const story = route?.params?.story;

  // If story is missing, show a safe fallback screen instead of crashing
  if (!story) {
    return (
      <Background>
        <SafeAreaView style={styles.centered}>
          <Text style={styles.errorMsg}>
            Story not found. Please generate a new story.
          </Text>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.backBtnText}>← Back to Home</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Background>
    );
  }

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
    });

    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const startPlayback = async () => {
    try {
      setLoadingAudio(true);

      // 1. Request TTS file
      const res = await axios.post(`${BASE_URL}/tts`, {
        story_text: story,
      });

      const filename = res.data?.filename;
      if (!filename) throw new Error("No filename returned from backend.");

      // 2. Build URL
      const audioUrl = `${BASE_URL}/audio/${filename}`;

      // 3. Load and play it
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      console.log("Audio error:", err);
      alert("Could not load the audio.");
    } finally {
      setLoadingAudio(false);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      await startPlayback();
      return;
    }

    const status = await sound.getStatusAsync();

    if (status.isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.header}>Your Story ✨</Text>
          <Text style={styles.story}>{story}</Text>

          <View style={styles.buttonWrap}>
            {loadingAudio ? (
              <ActivityIndicator color={colors.primary} size="large" />
            ) : (
              <TouchableOpacity style={styles.playBtn} onPress={togglePlayPause}>
                <Text style={styles.playBtnText}>
                  {isPlaying ? "⏸ Pause" : "🔊 Listen to Story"}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  inner: {
    padding: 22,
    paddingBottom: 60,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorMsg: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  header: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 32,
    textAlign: "center",
    marginBottom: 20,
  },
  story: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: typography.body,
    lineHeight: typography.lineHeight,
    marginBottom: 40,
  },
  buttonWrap: {
    alignItems: "center",
    gap: 18,
  },
  playBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: "80%",
  },
  playBtnText: {
    color: "#000",
    fontFamily: typography.fontFamily,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  backBtn: {
    paddingVertical: 10,
  },
  backBtnText: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    textAlign: "center",
  },
});