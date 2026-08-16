import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "../state/store";
import { colors, radius, type } from "../theme/tokens";
import { useReduceMotion } from "./useReduceMotion";

export function FlashBanner() {
  const { state, dispatch } = useApp();
  const reduceMotion = useReduceMotion();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!state.flash) return;
    const timer = setTimeout(() => dispatch({ type: "CLEAR_FLASH" }), 3200);
    return () => clearTimeout(timer);
  }, [state.flash, dispatch]);

  if (!state.flash) return null;

  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      entering={reduceMotion ? undefined : FadeIn.duration(160)}
      exiting={reduceMotion ? undefined : FadeOut.duration(160)}
      style={[styles.banner, { top: insets.top + 8 }]}
    >
      <Text style={styles.text}>{state.flash}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 50,
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    ...type.callout,
    color: colors.cream,
    textAlign: "center",
  },
});
