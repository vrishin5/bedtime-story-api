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

  // Pull selected voice from settings
  const { voice } = useSettings();

  if (!story) {
    return (
      <Background>
        <SafeAreaView style={styles.centered}>
          <Text style={styles.errorMsg}>Story not found. Please try again.</Text>
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

  // Allow playback in silent mode
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  // Start audio from beginning (fetch + play)
  const startPlayback = async () => {
    try {
      setLoadingAudio(true);

      // Request TTS with voice
      const res = await axios.post(`${BASE_URL}/tts`, {
        story_text: story,
        voice: voice,   // << IMPORTANT
      });

      const filename = res.data?.filename;
      if (!filename) throw new Error("No filename returned.");

      const audioUrl = `${BASE_URL}/audio/${filename}`;

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
      console.log("AUDIO ERROR:", err);
      alert("Could not load audio. Please try again.");
    } finally {
      setLoadingAudio(false);
    }
  };

  // Toggle playback
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

  // Restart audio
  const restartAudio = async () => {
    if (!sound) {
      await startPlayback();
      return;
    }

    await sound.setPositionAsync(0);
    await sound.playAsync();
    setIsPlaying(true);
  };

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.inner}>
          
          {/* Top Buttons */}
          <View style={styles.topButtons}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backTopText}>← Back</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayPause} style={styles.listenTopBtn}>
              <Text style={styles.listenTopText}>
                {isPlaying ? "⏸ Pause" : "🔊 Listen"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.header}>Your Story ✨</Text>

          <Text style={styles.story}>{story}</Text>

          {/* Bottom audio controls */}
          <View style={styles.audioButtons}>
            {loadingAudio ? (
              <ActivityIndicator color={colors.primary} size="large" />
            ) : (
              <>
                <TouchableOpacity style={styles.controlBtn} onPress={togglePlayPause}>
                  <Text style={styles.controlBtnText}>
                    {isPlaying ? "⏸ Pause" : "▶️ Play"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlBtn} onPress={restartAudio}>
                  <Text style={styles.controlBtnText}>⏮ Restart</Text>
                </TouchableOpacity>
              </>
            )}
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
  },
  backTopText: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 20,
  },
  listenTopBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  listenTopText: {
    color: colors.primary,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    fontWeight: "600",
  },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
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
  audioButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    marginBottom: 50,
  },
  controlBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  controlBtnText: {
    color: "#000",
    fontFamily: typography.fontFamily,
    fontSize: 20,
    fontWeight: "600",
  },
  backBtn: {
    marginTop: 20,
  },
  backBtnText: {
    color: colors.primary,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    textAlign: "center",
  },
});