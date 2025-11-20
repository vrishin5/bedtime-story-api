import React from "react";
import { View, StyleSheet, Image } from "react-native";

export default function StarHeader() {
  return (
    <View style={styles.wrap}>
      <Image
        source={require("../assets/images/moon-stars.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", marginTop: 20, marginBottom: -10 },
  image: {
    width: 200,
    height: 200,
    opacity: 0.95,   // soft glow effect
  },
});