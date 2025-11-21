import React, { createContext, useState, useContext } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [childAge, setChildAge] = useState("5–8");
  const [storyLength, setStoryLength] = useState("5–10 minutes");

  // NEW: background ambience settings
  const [ambienceEnabled, setAmbienceEnabled] = useState(true);
  const [ambienceVolume, setAmbienceVolume] = useState(0.4); // 40% default

  return (
    <SettingsContext.Provider
      value={{
        childAge,
        storyLength,
        setChildAge,
        setStoryLength,

        ambienceEnabled,
        ambienceVolume,
        setAmbienceEnabled,
        setAmbienceVolume,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}