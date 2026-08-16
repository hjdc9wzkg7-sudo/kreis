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
      { scale: 1 + progress.value * 0.06 },
    ],
  }));

  return <Animated.View pointerEvents="none" style={[style, animated]} />;
}

export function Atmosphere({ children }: { children: ReactNode }) {
  return (
    <View style={styles.atmosphere}>
      <LinearGradient
        colors={["#FBF6EF", "#F3E7D8", "#E8F0E6"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <DriftOrb style={styles.orbClay} x={-28} y={22} duration={motion.driftMs.clay} />
      <DriftOrb style={styles.orbSage} x={24} y={-18} duration={motion.driftMs.sage} />
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
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(196,113,74,0.18)",
    top: -90,
    right: -80,
  },
  orbSage: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(95,134,102,0.16)",
    bottom: 70,
    left: -90,
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
