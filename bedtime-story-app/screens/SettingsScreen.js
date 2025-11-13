import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Background from "../components/Background";
import { colors, typography } from "./theme";

export default function SettingsScreen({ navigation }) {
  const [voice, setVoice] = useState("female");

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>⚙️ Story Settings</Text>

        <Text style={styles.label}>Select Voice Type</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={voice} onValueChange={setVoice} dropdownIconColor={colors.text} style={styles.picker}>
            <Picker.Item label="🌸 Female Voice" value="female" />
            <Picker.Item label="🎩 Male Voice" value="male" />
          </Picker>
        </View>

        <View style={{ marginTop: 24 }}>
          <Button title="Save & Return" color={colors.primary} onPress={() => navigation.navigate("Home", { selectedVoice: voice })} />
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { color: colors.text, fontSize: typography.title, fontWeight: "700", textAlign: "center", marginBottom: 14 },
  label: { color: colors.subtext, marginTop: 12, marginBottom: 6 },
  pickerWrap: {
    backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: "hidden"
  },
  picker: { color: colors.text },
});
