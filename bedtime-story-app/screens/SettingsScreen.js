import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import Modal from "react-native-modal";
import Background from "../components/Background";
import { colors, typography } from "./theme";
import { useSettings } from "../context/SettingsContext";

export default function SettingsScreen({ navigation }) {
  const { childAge, storyLength, setChildAge, setStoryLength } = useSettings();

  const [modalVisible, setModalVisible] = useState(false);
  const [pickerType, setPickerType] = useState(null);

  const openPicker = (type) => {
    setPickerType(type);
    setModalVisible(true);
  };

  const getOptions = () => {
    if (pickerType === "age") return ["3–5", "5–8", "8–10"];
    if (pickerType === "length")
      return ["5–10 minutes", "15–30 minutes", "30–60 minutes"];
    return [];
  };

  const handleSelect = (value) => {
    if (pickerType === "age") {
      setChildAge(value);
    } else if (pickerType === "length") {
      setStoryLength(value);
    }
    setModalVisible(false);
  };

  const modalTitle =
    pickerType === "age" ? "Select Child’s Age" : "Select Story Length";

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Settings ⚙️</Text>

        {/* AGE SELECTOR */}
        <TouchableOpacity
          style={styles.selector}
          onPress={() => openPicker("age")}
        >
          <Text style={styles.selectorLabel}>Child’s Age</Text>
          <Text style={styles.selectorValue}>{childAge}</Text>
        </TouchableOpacity>

        {/* STORY LENGTH SELECTOR */}
        <TouchableOpacity
          style={styles.selector}
          onPress={() => openPicker("length")}
        >
          <Text style={styles.selectorLabel}>Story Length</Text>
          <Text style={styles.selectorValue}>{storyLength}</Text>
        </TouchableOpacity>

        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* MODAL LIST SELECTION */}
        <Modal
          isVisible={modalVisible}
          style={styles.modal}
          onBackdropPress={() => setModalVisible(false)}
          backdropOpacity={0.4}
        >
          <View style={styles.sheet}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>

            {getOptions().map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionRow}
                onPress={() => handleSelect(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 34,
    textAlign: "center",
    marginBottom: 28,
  },
  selector: {
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorLabel: {
    color: colors.subtext,
    fontFamily: typography.fontFamily,
    fontSize: 16,
  },
  selectorValue: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 22,
    marginTop: 4,
  },
  backBtn: {
    marginTop: 40,
    alignItems: "center",
  },
  backText: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 22,
  },

  // Modal
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  sheet: {
    backgroundColor: "#2A1A55",
    paddingTop: 18,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 14,
  },
  optionRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  optionText: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    textAlign: "center",
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 10,
  },
  cancelText: {
    color: colors.primary,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    textAlign: "center",
  },
});