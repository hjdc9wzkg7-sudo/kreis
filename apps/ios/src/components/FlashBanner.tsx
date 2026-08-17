import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "../state/store";
import { colors, motion, radius, space, type } from "../theme/tokens";
import { GlassSurface } from "./glass";
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
      entering={
        reduceMotion
          ? undefined
          : FadeIn.springify().damping(motion.enter.damping).stiffness(motion.enter.stiffness)
      }
      exiting={reduceMotion ? undefined : FadeOut.duration(180)}
      style={[styles.wrap, { top: insets.top + space.xs }]}
    >
      <GlassSurface tone="strong" style={styles.banner}>
        <Animated.Text style={styles.text}>{state.flash}</Animated.Text>
      </GlassSurface>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: space.md,
    right: space.md,
    zIndex: 50,
  },
  banner: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(227,106,74,0.28)",
  },
  text: {
    ...type.callout,
    color: colors.ink,
    textAlign: "center",
  },
});
