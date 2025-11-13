import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function StarHeader() {
  return (
    <View style={styles.wrap}>
      <LottieView
        source={require("../assets/lottie/moon-stars.json")}
        autoPlay
        loop
        style={{ width: 200, height: 200, opacity: 0.9 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { alignItems: "center", marginTop: 16, marginBottom: -16 },
});
