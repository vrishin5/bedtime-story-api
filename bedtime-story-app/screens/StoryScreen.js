import React, { useState, useEffect, useRef } from "react";
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
  const { story } = route.params;
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function playAudio() {
    try {
      setLoadingAudio(true);
      const response = await axios.post(`${BASE_URL}/tts`, {
        story_text: story,
      });

      const { uri } = response.data;

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) setIsPlaying(false);
      });
    } catch (e) {
      console.error(e);
      alert("Could not load audio.");
    } finally {
      setLoadingAudio(false);
    }
  }

  async function togglePlayPause() {
    if (!sound) return;
    const status = await sound.getStatusAsync();

    if (status.isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.header}>Your Story ✨</Text>

          <Text style={styles.story}>{story}</Text>

          <View style={styles.buttonWrap}>
            {loadingAudio ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <TouchableOpacity style={styles.playBtn} onPress={sound ? togglePlayPause : playAudio}>
                <Text style={styles.playBtnText}>
                  {sound ? (isPlaying ? "⏸ Pause" : "▶️ Play") : "🔊 Listen to Story"}
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
    paddingBottom: 50,
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
    textAlign: "center",
    fontSize: 20,
    color: "#000",
    fontWeight: "600",
  },
  backBtn: {
    paddingVertical: 10,
  },
  backBtnText: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 18,
  },
});