import { Redirect } from "expo-router";

import { useApp } from "@/src/state/store";

export default function Index() {
  const { state } = useApp();

  if (!state.ageVerified || !state.onboardingComplete) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}
