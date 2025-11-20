import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import axios from "axios";
import Background from "../components/Background";
import AppLogo from "../components/AppLogo";
import { useSettings } from "../context/SettingsContext";
import { colors, typography } from "./theme";

const BASE_URL = "https://bedtime-story-api-tdhc.onrender.com";

export default function HomeScreen({ navigation }) {
  const { childAge, storyLength } = useSettings();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.inner}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Logo */}
              <AppLogo />

              <Text style={styles.subtitle}>
                Create magical bedtime stories for your little dreamer ✨
              </Text>

              {/* READ-ONLY SETTINGS */}
              <Text style={styles.selectedInfo}>🌟 Age: {childAge}</Text>
              <Text style={styles.selectedInfo}>⏱ Length: {storyLength}</Text>

              {/* STORY INPUT */}
              <TextInput
                style={styles.input}
                placeholder="Describe your story idea… You may include a main character’s name, theme, or world!"
                placeholderTextColor={colors.subtext}
                value={prompt}
                onChangeText={setPrompt}
                multiline
              />

              {/* GENERATE BUTTON */}
              {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <TouchableOpacity
                  style={styles.generateBtn}
                  onPress={async () => {
                    if (!prompt.trim()) return;

                    try {
                      setLoading(true);

                      const res = await axios.post(`${BASE_URL}/generate_story`, {
                        user_input: prompt,
                        child_age: childAge,
                        story_duration: storyLength,
                      });

                      navigation.navigate("Story", { story: res.data.story });
                    } catch (e) {
                      console.error(e);
                      alert("Failed to generate story.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <Text style={styles.generateBtnText}>🪄 Generate Story</Text>
                </TouchableOpacity>
              )}

              {/* SETTINGS BUTTON — FIXED */}
              <TouchableOpacity
                style={styles.settingsBtn}
                onPress={() => navigation.navigate("Settings")}
              >
                <Text style={styles.settingsBtnText}>⚙️ Settings</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  inner: {
    padding: 22,
    paddingBottom: 60,
  },
  subtitle: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: typography.subtitle,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.9,
  },
  selectedInfo: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    marginBottom: 6,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.12)",
    color: colors.text,
    padding: 14,
    marginVertical: 20,
    minHeight: 130,
    borderRadius: 14,
    fontFamily: typography.fontFamily,
    fontSize: typography.body,
    lineHeight: typography.lineHeight,
    textAlignVertical: "top",
  },

  /* GENERATE BUTTON */
  generateBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  generateBtnText: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },

  /* SETTINGS BUTTON — FIXED */
  settingsBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  settingsBtnText: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
});