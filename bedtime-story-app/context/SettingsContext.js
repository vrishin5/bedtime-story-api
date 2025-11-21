import React, { createContext, useState, useContext } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [childAge, setChildAge] = useState("5–8");
  const [storyLength, setStoryLength] = useState("5–10 minutes");

  // Night ambience sound settings
  const [ambienceEnabled, setAmbienceEnabled] = useState(true);
  const [ambienceVolume, setAmbienceVolume] = useState(0.4); // 0–1

  // Voice settings: "sage" (softer) and "verse" (storyteller)
  const [voice, setVoice] = useState("sage");

  return (
    <SettingsContext.Provider
      value={{
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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}