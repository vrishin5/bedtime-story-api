import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import { colors, typography } from "../screens/theme";

export default function Dropdown({ label, options, value, onSelect }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>{label}</Text>

      <ModalDropdown
        options={options}
        defaultValue={value}
        onSelect={(idx, option) => onSelect(option)}
        dropdownStyle={styles.dropdown}
        textStyle={styles.text}
        dropdownTextStyle={styles.dropdownText}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.selector}>
          <Text style={styles.selected}>{value}</Text>
        </TouchableOpacity>
      </ModalDropdown>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    marginBottom: 8,
  },
  selector: {
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 18,
  },
  dropdown: {
    width: "80%",
    backgroundColor: colors.bgBottom,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 5,
  },
  text: {
    fontSize: 18,
    color: colors.text,
    fontFamily: typography.fontFamily,
  },
  dropdownText: {
    fontSize: 18,
    color: colors.text,
    fontFamily: typography.fontFamily,
    padding: 10,
  },
});