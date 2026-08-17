import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { motion } from "../theme/tokens";
import { useReduceMotion } from "./useReduceMotion";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableScale({
  children,
  onPress,
  style,
  disabled,
  haptic = "light",
  pressedScale = motion.pressScale,
  accessibilityLabel,
  accessibilityRole = "button",
  accessibilityState,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  haptic?: "light" | "success" | "medium" | "warning" | "none";
  pressedScale?: number;
  accessibilityLabel?: string;
  accessibilityRole?: "button" | "link" | "none";
  accessibilityState?: { disabled?: boolean; selected?: boolean };
}) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      accessibilityRole={accessibilityRole === "none" ? undefined : accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: Boolean(disabled), ...accessibilityState }}
      onPressIn={() => {
        if (!reduceMotion) {
          scale.value = withSpring(pressedScale, motion.pressIn);
        }
      }}
      onPressOut={() => {
        if (!reduceMotion) {
          scale.value = withSpring(1, motion.pressOut);
        }
      }}
      onPress={() => {
        if (haptic === "light") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (haptic === "medium") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (haptic === "success") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (haptic === "warning") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        onPress?.();
      }}
      style={[animated, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

export function Enter({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const reduce = useReduceMotion();
  if (reduce) {
    return <Animated.View style={style}>{children}</Animated.View>;
  }
  return (
    <Animated.View
      entering={FadeInDown.springify()
        .damping(motion.enter.damping)
        .stiffness(motion.enter.stiffness)
        .mass(motion.enter.mass)
        .delay(delay)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
