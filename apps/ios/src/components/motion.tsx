import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import Animated, { Easing, FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

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
  haptic?: "light" | "success" | "medium" | "none";
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
        if (haptic === "medium" || haptic === "success") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        if (!reduceMotion) {
          scale.value = withSpring(0.94, motion.pressIn);
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
      entering={FadeInDown.duration(480)
        .delay(delay)
        .easing(Easing.out(Easing.cubic))
        .springify()
        .damping(20)
        .stiffness(170)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
