import { Stack } from "expo-router";

import { colors } from "@/src/theme/tokens";

export default function CirclesStack() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: colors.clayDark,
        headerTitleStyle: { fontWeight: "600", color: colors.ink },
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
