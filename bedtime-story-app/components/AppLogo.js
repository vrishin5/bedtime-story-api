import React from "react";
import { View, Image, StyleSheet } from "react-native";

export default function AppLogo() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/moonlit_logo.png")} 
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  logo: {
    width: 260,
    height: 260,
    borderRadius: 20,     // helps it blend with UI
  },
});