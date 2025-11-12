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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000"; // change to your backend URL when deployed

export default function HomeScreen({ navigation }) {
  const [age, setAge] = useState("5–8");
  const [duration, setDuration] = useState("5–10 minutes");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/generate_story`, {
        user_input: prompt,
        child_age: age,
        story_duration: duration,
      });
      navigation.navigate("Story", { story: res.data.story });
    } catch (err) {
      console.error(err);
      alert("Failed to generate story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>🌙 Bedtime Story Generator</Text>

          <Text style={styles.label}>Child's Age:</Text>
          <Picker selectedValue={age} onValueChange={setAge} style={styles.picker}>
            <Picker.Item label="3–5" value="3–5" />
            <Picker.Item label="5–8" value="5–8" />
            <Picker.Item label="8–10" value="8–10" />
          </Picker>

          <Text style={styles.label}>Story Length:</Text>
          <Picker selectedValue={duration} onValueChange={setDuration} style={styles.picker}>
            <Picker.Item label="5–10 minutes" value="5–10 minutes" />
            <Picker.Item label="15–30 minutes" value="15–30 minutes" />
            <Picker.Item label="30–60 minutes" value="30–60 minutes" />
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Describe your story idea..."
            value={prompt}
            onChangeText={setPrompt}
            multiline
          />

          {loading ? (
            <ActivityIndicator size="large" color="#6C63FF" />
          ) : (
            <Button title="🪄 Generate Story" onPress={handleGenerate} />
          )}

          <View style={{ marginTop: 20 }}>
            <Button
              title="⚙️ Go to Settings"
              color="#6C63FF"
              onPress={() => navigation.navigate("Settings")}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 16, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 20,
    height: 100,
    textAlignVertical: "top",
  },
  picker: { backgroundColor: "#f0f0f0", marginVertical: 5 },
});
