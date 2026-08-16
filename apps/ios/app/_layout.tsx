import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";

import { FlashBanner } from "@/src/components/FlashBanner";
import { AppProvider, useApp } from "@/src/state/store";
import { colors } from "@/src/theme/tokens";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

function Gate() {
  const { hydrated, state } = useApp();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.cream }}>
        <ActivityIndicator color={colors.clay} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      {state.flash ? <FlashBanner /> : null}
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: colors.clayDark,
          headerBackTitle: "Zurück",
          headerBackButtonDisplayMode: "generic",
          headerStyle: { backgroundColor: colors.cream },
          headerTitleStyle: { color: colors.ink, fontWeight: "600" },
          contentStyle: { backgroundColor: colors.cream },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="kreis/[id]"
          options={{
            title: "Kreis",
            headerBackTitle: "Zurück",
            headerBackButtonDisplayMode: "generic",
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="melden"
          options={{
            title: "Melden",
            presentation: "modal",
            headerBackTitle: "Zurück",
            headerBackButtonDisplayMode: "generic",
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <Gate />
    </AppProvider>
  );
}
