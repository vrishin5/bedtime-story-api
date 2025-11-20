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
import AppLogo from "../components/AppLogo";
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
              <AppLogo />

              <Text style={styles.subtitle}>
                Create magical bedtime stories for your little dreamer ✨
              </Text>

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

              <TextInput
                style={styles.input}
                placeholder="Describe your story idea… You may include a main character’s name or theme!"
                placeholderTextColor={colors.subtext}
                value={prompt}
                onChangeText={setPrompt}
                multiline
              />

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

              <View style={{ height: 25 }} />
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
  inner: {
    padding: 20,
    paddingBottom: 50,
  },
  subtitle: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: typography.subtitle,
    textAlign: "center",
    marginBottom: 25,
    opacity: 0.9,
  },
  label: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    marginTop: 14,
    marginBottom: 6,
    fontSize: typography.body,
  },
  pickerWrap: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 12,
  },
  picker: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    height: 52,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.text,
    padding: 14,
    marginVertical: 20,
    minHeight: 130,
    borderRadius: 16,
    fontFamily: typography.fontFamily,
    fontSize: typography.body,
    textAlignVertical: "top",
  },
});