import { Stack } from "expo-router";

import { colors } from "@/src/theme/tokens";

export default function CirclesStack() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: colors.coralDark,
        headerBackTitle: "Zurück",
        headerBackButtonDisplayMode: "generic",
        headerTitleStyle: { fontWeight: "600", color: colors.ink },
        contentStyle: { backgroundColor: colors.cream },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
