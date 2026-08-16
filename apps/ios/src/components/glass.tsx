import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode, useEffect } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

import { colors, motion, radius } from "../theme/tokens";
import { useReduceMotion } from "./useReduceMotion";

function canUseNativeGlass() {
  try {
    return Platform.OS === "ios" && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
  } catch {
    return false;
  }
}

function DriftOrb({
  style,
  x,
  y,
  duration,
}: {
  style: StyleProp<ViewStyle>;
  x: number;
  y: number;
  duration: number;
}) {
  const reduce = useReduceMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduce) {
      progress.value = 0;
      return;
    }
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [duration, progress, reduce]);

  const animated = useAnimatedStyle(() => ({
    transform: [
      { translateX: progress.value * x },
      { translateY: progress.value * y },
      { scale: 1 + progress.value * 0.1 },
    ],
    opacity: 0.88 + progress.value * 0.12,
  }));

  return <Animated.View pointerEvents="none" style={[style, animated]} />;
}

export function Atmosphere({ children }: { children: ReactNode }) {
  return (
    <View style={styles.atmosphere}>
      <LinearGradient
        colors={["#FFF6EE", "#F8DCC8", "#E4F0E6"]}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 0.95, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <DriftOrb style={styles.orbClay} x={-40} y={28} duration={motion.driftMs.clay} />
      <DriftOrb style={styles.orbSage} x={32} y={-24} duration={motion.driftMs.sage} />
      {children}
    </View>
  );
}

export function GlassSurface({
  children,
  style,
  padded = true,
  intensity = 36,
  native = true,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  intensity?: number;
  native?: boolean;
}) {
  const content = (
    <View style={[padded && styles.pad, style]} pointerEvents="box-none">
      {children}
    </View>
  );

  if (native && canUseNativeGlass()) {
    return (
      <GlassView
        glassEffectStyle="regular"
        tintColor={colors.cream}
        style={[styles.clip, style]}
      >
        {content}
      </GlassView>
    );
  }

  return (
    <View style={[styles.fallback, styles.clip, style]}>
      <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.sheen} pointerEvents="none" />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  atmosphere: {
    flex: 1,
    backgroundColor: colors.cream,
    overflow: "hidden",
  },
  orbClay: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(227,106,74,0.32)",
    top: -96,
    right: -72,
  },
  orbSage: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(92,138,104,0.26)",
    bottom: 64,
    left: -84,
  },
  clip: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  fallback: {
    backgroundColor: colors.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    shadowColor: "#241F1C",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  sheen: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.7)",
    borderRadius: radius.lg,
  },
  pad: {
    padding: 18,
  },
});
