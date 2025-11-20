import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import Background from "../components/Background";
import { colors, typography } from "./theme";

export default function SettingsScreen({ navigation }) {
  const [voice, setVoice] = useState("female");

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Settings ⚙️</Text>

        <Text style={styles.label}>Voice Type</Text>

        <TouchableOpacity
          style={[
            styles.option,
            voice === "female" && styles.optionSelected,
          ]}
          onPress={() => setVoice("female")}
        >
          <Text style={styles.optionText}>Female Voice 🌙</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            voice === "male" && styles.optionSelected,
          ]}
          onPress={() => setVoice("male")}
        >
          <Text style={styles.optionText}>Male Voice ⭐</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 32,
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    marginBottom: 14,
  },
  option: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: "rgba(200,182,255,0.2)",
  },
  optionText: {
    color: colors.text,
    fontSize: 20,
    fontFamily: typography.fontFamily,
  },
  back: { marginTop: 30 },
  backText: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    textAlign: "center",
  },
});