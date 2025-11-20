import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import Background from "../components/Background";
import StarHeader from "../components/StarHeader";
import { colors, typography } from "./theme";

const BASE_URL = "https://bedtime-story-api-tdhc.onrender.com";

export default function HomeScreen({ navigation }) {
  const [age, setAge] = useState("5–8");
  const [duration, setDuration] = useState("5–10 minutes");
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
              {/* 🌙 Animated Header */}
              <StarHeader />

              <Text style={styles.title}>🌙 Bedtime Story Generator</Text>

              {/* AGE PICKER */}
              <Text style={styles.label}>Child’s Age</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={age}
                  onValueChange={setAge}
                  dropdownIconColor={colors.text}
                  style={styles.picker}
                >
                  <Picker.Item label="3–5" value="3–5" />
                  <Picker.Item label="5–8" value="5–8" />
                  <Picker.Item label="8–10" value="8–10" />
                </Picker>
              </View>

              {/* STORY LENGTH PICKER */}
              <Text style={styles.label}>Story Length</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={duration}
                  onValueChange={setDuration}
                  dropdownIconColor={colors.text}
                  style={styles.picker}
                >
                  <Picker.Item label="5–10 minutes" value="5–10 minutes" />
                  <Picker.Item label="15–30 minutes" value="15–30 minutes" />
                  <Picker.Item label="30–60 minutes" value="30–60 minutes" />
                </Picker>
              </View>

              {/* STORY PROMPT */}
              <TextInput
                style={styles.input}
                placeholder="Describe your story idea or pick a category (fantasy, fairy tales, adventure, friendship, animals, courage, comedy)…"
                placeholderTextColor={colors.subtext}
                value={prompt}
                onChangeText={setPrompt}
                multiline
              />

              {/* GENERATE BUTTON */}
              {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <Button
                  title="🪄 Generate Story"
                  color={colors.primary}
                  onPress={async () => {
                    if (!prompt.trim()) return;
                    try {
                      setLoading(true);
                      const res = await axios.post(`${BASE_URL}/generate_story`, {
                        user_input: prompt,
                        child_age: age,
                        story_duration: duration,
                      });
                      navigation.navigate("Story", { story: res.data.story });
                    } catch (e) {
                      console.error(e);
                      alert("Failed to generate story. Please try again.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
              )}

              {/* SETTINGS BUTTON */}
              <View style={{ height: 24 }} />
              <Button
                title="⚙️ Settings"
                color={colors.primary}
                onPress={() => navigation.navigate("Settings")}
              />

              <View style={{ height: 40 }} />
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  // No justifyContent: "center" so items don't get pushed off-screen
  inner: {
    padding: 20,
    paddingBottom: 50, // ensures last buttons remain visible
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  label: { color: colors.subtext, marginTop: 14, marginBottom: 6 },
  pickerWrap: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 10,
  },
  picker: { color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.text,
    padding: 12,
    marginVertical: 16,
    minHeight: 110,
    textAlignVertical: "top",
    borderRadius: 12,
  },
});
