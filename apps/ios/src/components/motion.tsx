import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { motion } from "../theme/tokens";
import { useReduceMotion } from "./useReduceMotion";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableScale({
  children,
  onPress,
  style,
  disabled,
  haptic = "light",
  accessibilityLabel,
  accessibilityRole = "button",
  accessibilityState,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  haptic?: "light" | "success" | "none";
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
          scale.value = withSpring(0.96, motion.pressIn);
        }
      }}
      onPressOut={() => {
        if (!reduceMotion) {
          scale.value = withSpring(1, motion.pressOut);
        }
      }}
      onPress={() => {
        if (haptic === "light") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (haptic === "success") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onPress?.();
      }}
      style={[animated, style]}
    >
      {children}
    </AnimatedPressable>
  );
}


