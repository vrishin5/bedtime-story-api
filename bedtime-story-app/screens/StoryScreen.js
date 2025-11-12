import React from "react";
import { View, Text, ScrollView, Button, StyleSheet } from "react-native";

export default function StoryScreen({ route, navigation }) {
  const { story } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Your Bedtime Story</Text>

      <ScrollView style={styles.storyContainer}>
        <Text style={styles.storyText}>{story}</Text>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="🔙 Back to Home" onPress={() => navigation.navigate("Home")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  storyContainer: { flex: 1 },
  storyText: { fontSize: 16, lineHeight: 24, color: "#333" },
  buttonContainer: { marginTop: 20 },
});
