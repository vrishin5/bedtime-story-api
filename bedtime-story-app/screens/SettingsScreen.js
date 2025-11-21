import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Slider,
} from "react-native";

import Modal from "react-native-modal";
import Background from "../components/Background";
import { colors, typography } from "./theme";
import { useSettings } from "../context/SettingsContext";

export default function SettingsScreen({ navigation }) {
  const {
    childAge,
    storyLength,
    setChildAge,
    setStoryLength,
    ambienceEnabled,
    setAmbienceEnabled,
    ambienceVolume,
    setAmbienceVolume,
  } = useSettings();

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
    if (pickerType === "age") setChildAge(value);
    if (pickerType === "length") setStoryLength(value);
    setModalVisible(false);
  };

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Settings ⚙️</Text>

        {/* AGE */}
        <TouchableOpacity style={styles.selector} onPress={() => openPicker("age")}>
          <Text style={styles.selectorLabel}>Child’s Age</Text>
          <Text style={styles.selectorValue}>{childAge}</Text>
        </TouchableOpacity>

        {/* LENGTH */}
        <TouchableOpacity
          style={styles.selector}
          onPress={() => openPicker("length")}
        >
          <Text style={styles.selectorLabel}>Story Length</Text>
          <Text style={styles.selectorValue}>{storyLength}</Text>
        </TouchableOpacity>

        {/* AMBIENCE TOGGLE */}
        <View style={styles.selector}>
          <Text style={styles.selectorLabel}>Night Ambience</Text>
          <View style={styles.row}>
            <Text style={styles.selectorValue}>
              {ambienceEnabled ? "On" : "Off"}
            </Text>
            <Switch
              value={ambienceEnabled}
              onValueChange={setAmbienceEnabled}
              trackColor={{ true: colors.primary }}
            />
          </View>
        </View>

        {/* AMBIENCE VOLUME */}
        <View style={styles.selector}>
          <Text style={styles.selectorLabel}>Ambience Volume</Text>
          <Slider
            minimumValue={0}
            maximumValue={1}
            value={ambienceVolume}
            onValueChange={setAmbienceVolume}
            minimumTrackTintColor={colors.primary}
          />
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* MODAL */}
        <Modal
          isVisible={modalVisible}
          style={styles.modal}
          onBackdropPress={() => setModalVisible(false)}
        >
          <View style={styles.sheet}>
            {getOptions().map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.option}
                onPress={() => handleSelect(opt)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { color: colors.text, fontFamily: typography.fontFamily, fontSize: 32, textAlign: "center", marginBottom: 28 },
  selector: {
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorLabel: { color: colors.subtext, fontFamily: typography.fontFamily, fontSize: 16 },
  selectorValue: { color: colors.text, fontFamily: typography.fontFamily, fontSize: 22, marginTop: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  backBtn: { marginTop: 40, alignItems: "center" },
  backText: { color: colors.text, fontFamily: typography.fontFamily, fontSize: 22 },

  modal: { justifyContent: "flex-end", margin: 0 },
  sheet: { backgroundColor: "#2A1A55", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  option: { padding: 14, borderBottomColor: "#444", borderBottomWidth: 1 },
  optionText: { color: colors.text, fontFamily: typography.fontFamily, fontSize: 20, textAlign: "center" },
});