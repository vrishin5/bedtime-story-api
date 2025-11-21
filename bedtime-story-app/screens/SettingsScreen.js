import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from "react-native";
import Modal from "react-native-modal";
import Slider from "@react-native-community/slider";

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
    voice,
    setVoice,
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
    else if (pickerType === "length") setStoryLength(value);
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

        {/* VOICE SELECTOR */}
        <View style={styles.selector}>
          <Text style={styles.selectorLabel}>Narrator Voice</Text>
          <View style={styles.voiceRow}>
            <TouchableOpacity
              style={[
                styles.voicePill,
                voice === "sage" && styles.voicePillActive,
              ]}
              onPress={() => setVoice("sage")}
            >
              <Text
                style={[
                  styles.voiceText,
                  voice === "sage" && styles.voiceTextActive,
                ]}
              >
                🌸 Sage
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.voicePill,
                voice === "verse" && styles.voicePillActive,
              ]}
              onPress={() => setVoice("verse")}
            >
              <Text
                style={[
                  styles.voiceText,
                  voice === "verse" && styles.voiceTextActive,
                ]}
              >
                📖 Verse
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AMBIENCE TOGGLE */}
        <View style={styles.ambRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.selectorLabel}>Night Ambience</Text>
            <Text style={styles.ambSub}>
              Soft background sound while the story plays.
            </Text>
          </View>
          <Switch
            value={ambienceEnabled}
            onValueChange={setAmbienceEnabled}
            trackColor={{ false: "#444", true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        {/* AMBIENCE VOLUME SLIDER */}
        {ambienceEnabled && (
          <View style={styles.sliderWrap}>
            <Text style={styles.selectorLabel}>Ambience Volume</Text>
            <Slider
              style={{ width: "100%" }}
              minimumValue={0}
              maximumValue={1}
              value={ambienceVolume}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor="#555"
              thumbTintColor={colors.primary}
              onValueChange={setAmbienceVolume}
            />
          </View>
        )}

        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* MODAL FOR AGE / LENGTH */}
        <Modal
          isVisible={modalVisible}
          style={styles.modal}
          onBackdropPress={() => setModalVisible(false)}
          backdropOpacity={0.4}
        >
          <View className="sheet" style={styles.sheet}>
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

  // Modal sheet
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

  voiceRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  voicePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  voicePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  voiceText: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: 16,
  },
  voiceTextActive: {
    color: "#000",
    fontWeight: "700",
  },

  ambRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
    paddingVertical: 10,
  },
  ambSub: {
    color: colors.subtext,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    marginTop: 4,
  },
  sliderWrap: {
    marginBottom: 20,
  },
});