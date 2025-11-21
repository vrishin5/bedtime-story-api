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
import { useSettings } from "../context/SettingsContext";

const BASE_URL = "https://bedtime-story-api-tdhc.onrender.com";

export default function StoryScreen({ route, navigation }) {
  const story = route?.params?.story;

  const { ambienceEnabled, ambienceVolume } = useSettings();

  const [sound, setSound] = useState(null);
  const [ambienceSound, setAmbienceSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  // Load ambience on mount
  useEffect(() => {
    let mounted = true;

    const loadAmbience = async () => {
      if (!ambienceEnabled) return;

      const { sound: amb } = await Audio.Sound.createAsync(
        require("../assets/audio/night_ambience.mp3")
      );

      if (!mounted) return;

      amb.setVolumeAsync(ambienceVolume);
      amb.setIsLoopingAsync(true);
      amb.playAsync();

      setAmbienceSound(amb);
    };

    loadAmbience();

    return () => {
      mounted = false;
      if (ambienceSound) ambienceSound.unloadAsync();
      if (sound) sound.unloadAsync();
    };
  }, [ambienceEnabled, ambienceVolume]);

  const startPlayback = async () => {
    try {
      setLoadingAudio(true);
      const res = await axios.post(`${BASE_URL}/tts`, { story_text: story });

      const filename = res.data?.filename;
      if (!filename) throw new Error("No filename returned");

      const audioUrl = `${BASE_URL}/audio/${filename}`;

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((s) => {
        if (s.didJustFinish) setIsPlaying(false);
      });
    } catch (e) {
      console.log(e);
      alert("Could not load audio.");
    } finally {
      setLoadingAudio(false);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return startPlayback();

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

          {/* LISTEN BUTTON AT TOP */}
          <View style={{ alignItems: "center", marginBottom: 22 }}>
            {loadingAudio ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <TouchableOpacity style={styles.playBtn} onPress={togglePlayPause}>
                <Text style={styles.playBtnText}>
                  {isPlaying ? "⏸ Pause" : "🔊 Listen to Story"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.header}>Your Story ✨</Text>
          <Text style={styles.story}>{story}</Text>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  inner: { padding: 22, paddingBottom: 60 },
  header: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 32,
    textAlign: "center",
    marginBottom: 16,
  },
  story: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: typography.body,
    lineHeight: typography.lineHeight,
    marginBottom: 40,
  },
  playBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  playBtnText: {
    fontSize: 20,
    color: "#000",
    fontFamily: typography.fontFamily,
    fontWeight: "600",
  },
  backBtn: { alignItems: "center", marginTop: 20 },
  backBtnText: {
    color: colors.text,
    fontSize: 20,
    fontFamily: typography.fontFamily,
  },
});