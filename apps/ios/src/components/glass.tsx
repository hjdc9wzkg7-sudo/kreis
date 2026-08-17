import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode, useEffect } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

import { atmosphere, colors, glass, motion, radius, space } from "../theme/tokens";
import { useReduceMotion } from "./useReduceMotion";

export type GlassTone = "soft" | "regular" | "strong";

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
      { scale: 1 + progress.value * 0.04 },
    ],
    opacity: 0.92 + progress.value * 0.08,
  }));

  return <Animated.View pointerEvents="none" style={[style, animated]} />;
}

export function Atmosphere({ children }: { children: ReactNode }) {
  return (
    <View style={styles.atmosphere}>
      <LinearGradient
        colors={[...atmosphere.gradient]}
        start={{ x: 0.08, y: 0 }}
        end={{ x: 0.92, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <DriftOrb style={styles.orbCoral} x={-28} y={20} duration={motion.driftMs.clay} />
      <DriftOrb style={styles.orbPeach} x={18} y={-16} duration={motion.driftMs.peach} />
      <DriftOrb style={styles.orbSage} x={22} y={-18} duration={motion.driftMs.sage} />
      {children}
    </View>
  );
}

export function GlassSurface({
  children,
  style,
  padded = true,
  intensity,
  tone = "regular",
  native = true,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  intensity?: number;
  tone?: GlassTone;
  native?: boolean;
}) {
  const blur = intensity ?? glass[tone];
  const fill =
    tone === "strong" ? colors.glassStrong : tone === "soft" ? colors.glassSoft : colors.glass;
  const nativeStyle = tone === "soft" ? "clear" : "regular";

  const content = (
    <View style={padded ? styles.pad : undefined} pointerEvents="box-none">
      {children}
    </View>
  );

  if (native && canUseNativeGlass()) {
    return (
      <GlassView
        glassEffectStyle={nativeStyle}
        tintColor={colors.cream}
        style={[styles.clip, style]}
      >
        {content}
      </GlassView>
    );
  }

  return (
    <View style={[styles.fallback, { backgroundColor: fill }, styles.clip, style]}>
      <BlurView intensity={blur} tint="light" style={StyleSheet.absoluteFill} />
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
  orbCoral: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: atmosphere.orbCoral,
    top: -88,
    right: -64,
  },
  orbPeach: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: atmosphere.orbPeach,
    top: "38%",
    right: -90,
  },
  orbSage: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: atmosphere.orbSage,
    bottom: 72,
    left: -96,
  },
  clip: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  fallback: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    shadowColor: "#241F1C",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  sheen: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.62)",
    borderRadius: radius.lg,
  },
  pad: {
    padding: space.lg,
  },
});
