import React, { createContext, useState, useContext } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [childAge, setChildAge] = useState("5–8");
  const [storyLength, setStoryLength] = useState("5–10 minutes");

  return (
    <SettingsContext.Provider
      value={{
        childAge,
        storyLength,
        setChildAge,
        setStoryLength,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}