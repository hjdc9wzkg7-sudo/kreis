import { Stack } from "expo-router";

import { colors } from "@/src/theme/tokens";

export default function ProfileStack() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: colors.clayDark,
        headerBackTitle: "Profil",
        headerBackButtonDisplayMode: "minimal",
        headerTitleStyle: { fontWeight: "600", color: colors.ink },
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="einstellungen" options={{ title: "Einstellungen" }} />
      <Stack.Screen name="host-kits" options={{ title: "Checklisten" }} />
      <Stack.Screen name="sicherheit" options={{ title: "Sicherheit" }} />
      <Stack.Screen name="demo" options={{ title: "Demo & Datenschutz" }} />
    </Stack>
  );
}
