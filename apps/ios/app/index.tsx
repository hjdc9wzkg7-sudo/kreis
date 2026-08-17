import { Redirect } from "expo-router";

import { useAuth } from "@/src/lib/useAuth";
import { useApp } from "@/src/state/store";

export default function Index() {
  const { session } = useAuth();
  const { state } = useApp();

  if (!session) {
    return <Redirect href="/login" />;
  }

  if (!state.ageVerified || !state.onboardingComplete) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}
