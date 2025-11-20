import * as React from "react";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import StoryScreen from "./screens/StoryScreen";
import SettingsScreen from "./screens/SettingsScreen";

import { SettingsProvider } from "./context/SettingsContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function load() {
      await Font.loadAsync({
        CenturySchoolbook: require("./assets/fonts/CenturySchoolbook.ttf"),
      });
      setReady(true);
    }
    load();
  }, []);

  if (!ready) return null;

  return (
    <SettingsProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Story" component={StoryScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider>
  );
}