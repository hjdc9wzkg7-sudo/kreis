import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Atmosphere } from "@/src/components/glass";
import { FlashBanner } from "@/src/components/FlashBanner";
import { LoadingState } from "@/src/components/ui";
import { AuthProvider, useAuth } from "@/src/lib/useAuth";
import { AppProvider, useApp } from "@/src/state/store";
import { colors } from "@/src/theme/tokens";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

function Gate() {
  const { hydrated } = useApp();
  const { ready } = useAuth();

  if (!hydrated || !ready) {
    return (
      <Atmosphere>
        <LoadingState />
      </Atmosphere>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <FlashBanner />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: colors.coralDark,
          headerBackTitle: "Zurück",
          headerBackButtonDisplayMode: "generic",
          headerStyle: { backgroundColor: colors.cream },
          headerTitleStyle: { color: colors.ink, fontWeight: "600" },
          contentStyle: { backgroundColor: colors.cream },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
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
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </AppProvider>
  );
}
