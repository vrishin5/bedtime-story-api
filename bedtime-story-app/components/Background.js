import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { colors } from "../screens/theme";

export default function Background({ children }) {
  return (
    <LinearGradient
      colors={[colors.bgTop, colors.bgBottom]}
      style={styles.fill}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}
const styles = StyleSheet.create({ fill: { flex: 1 } });
