import React, { useState, useEffect, useMemo } from "react";
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
import Slider from "@react-native-community/slider";

import Background from "../components/Background";
import { colors, typography } from "./theme";
import { useSettings } from "../context/SettingsContext";

const BASE_URL = "https://bedtime-story-api-tdhc.onrender.com";

export default function StoryScreen({ route, navigation }) {
  const story = route?.params?.story;
  const { ambienceEnabled, ambienceVolume, voice } = useSettings();

  const [sound, setSound] = useState(null);
  const [ambienceSound, setAmbienceSound] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Split story into words for highlighting
  const words = useMemo(() => story?.split(/\s+/) ?? [], [story]);
  const totalWords = words.length || 1;
  const progress = duration > 0 ? position / duration : 0;
  const highlightedCount = Math.floor(progress * totalWords);

  if (!story) {
    return (
      <Background>
        <SafeAreaView style={styles.centered}>
          <Text style={styles.errorMsg}>
            Story not found. Please generate a new story.
          </Text>
          <TouchableOpacity
            style={styles.backBtnTop}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Background>
    );
  }

  // Load ambience only when enabled
  useEffect(() => {
    let mounted = true;

    const loadAmbience = async () => {
      if (!ambienceEnabled) return;

      const { sound: amb } = await Audio.Sound.createAsync(
        require("../assets/audio/night_ambience.mp3")
      );

      if (!mounted) return;

      await amb.setVolumeAsync(ambienceVolume);
      await amb.setIsLoopingAsync(true);
      await amb.playAsync();

      setAmbienceSound(amb);
    };

    loadAmbience();

    return () => {
      mounted = false;
      if (ambienceSound) ambienceSound.unloadAsync();
      if (sound) sound.unloadAsync();
    };
  }, [ambienceEnabled, ambienceVolume]);

  const formatTime = (ms) => {
    if (!ms) return "0:00";
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  const startPlayback = async () => {
    try {
      setLoadingAudio(true);
      setHasStarted(true);

      // Ask backend to generate TTS using selected voice
      const res = await axios.post(`${BASE_URL}/tts`, {
        story_text: story,
        voice: voice, // "sage" or "verse"
      });

      const filename = res.data?.filename;
      if (!filename) throw new Error("No filename returned");

      const audioUrl = `${BASE_URL}/audio/${filename}`;

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;

        if (!isScrubbing) setPosition(status.positionMillis);
        setDuration(status.durationMillis);

        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (e) {
      console.log("Audio error:", e);
      alert("Could not load audio.");
    } finally {
      setLoadingAudio(false);
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeAudio = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const restartAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    startPlayback();
  };

  // Scrubbing
  const onScrub = (value) => {
    setIsScrubbing(true);
    setPosition(value);
  };

  const onScrubComplete = async (value) => {
    setIsScrubbing(false);
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.inner}>
          {/* Back button at top */}
          <TouchableOpacity
            style={styles.backBtnTop}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>

          {/* Audio controls section */}
          <View style={{ alignItems: "center", marginBottom: 22 }}>
            {!hasStarted ? (
              loadingAudio ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <TouchableOpacity style={styles.playBtn} onPress={startPlayback}>
                  <Text style={styles.playBtnText}>🔊 Listen to Story</Text>
                </TouchableOpacity>
              )
            ) : (
              <>
                {/* Scrubbing slider */}
                <Slider
                  style={{ width: 260, marginBottom: 8 }}
                  minimumValue={0}
                  maximumValue={duration || 1}
                  value={position}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor="#666"
                  thumbTintColor={colors.primary}
                  onValueChange={onScrub}
                  onSlidingComplete={onScrubComplete}
                />

                <Text style={styles.timeText}>
                  {formatTime(position)} / {formatTime(duration)}
                </Text>

                {/* Control buttons */}
                <View style={styles.controlsRow}>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={pauseAudio}
                    disabled={!isPlaying}
                  >
                    <Text style={styles.controlBtnText}>⏸</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={resumeAudio}
                    disabled={isPlaying}
                  >
                    <Text style={styles.controlBtnText}>▶️</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={restartAudio}
                  >
                    <Text style={styles.controlBtnText}>🔄</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          <Text style={styles.header}>Your Story ✨</Text>

          {/* Highlighted story text */}
          <Text style={styles.story}>
            {words.map((word, idx) => {
              const isHighlighted = idx <= highlightedCount;
              return (
                <Text
                  key={idx}
                  style={isHighlighted ? styles.highlightWord : styles.word}
                >
                  {word + " "}
                </Text>
              );
            })}
          </Text>
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
  backBtnTop: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    marginBottom: 10,
  },
  backBtnText: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 20,
  },
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
    marginTop: 10,
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
  controlsRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 10,
  },
  controlBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  controlBtnText: {
    color: "#000",
    fontSize: 22,
    fontWeight: "700",
  },
  timeText: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    marginBottom: 4,
  },
  word: {
    color: colors.text,
  },
  highlightWord: {
    color: colors.primary,
    fontWeight: "600",
  },
});