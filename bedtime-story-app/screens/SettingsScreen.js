import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function SettingsScreen({ navigation }) {
  const [voice, setVoice] = useState("female");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Story Settings</Text>

      <Text style={styles.label}>Select Voice Type:</Text>
      <Picker
        selectedValue={voice}
        onValueChange={(itemValue) => setVoice(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="🌸 Female Voice" value="female" />
        <Picker.Item label="🎩 Male Voice" value="male" />
      </Picker>

      <View style={styles.buttons}>
        <Button
          title="Save & Return"
          onPress={() => navigation.navigate("Home", { selectedVoice: voice })}
          color="#6C63FF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: { fontSize: 16, marginTop: 15 },
  picker: { backgroundColor: "#f0f0f0", marginVertical: 10 },
  buttons: { marginTop: 30, alignItems: "center" },
});
