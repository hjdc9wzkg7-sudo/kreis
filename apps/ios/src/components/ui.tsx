import { ReactNode, useEffect } from "react";
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { colors, motion, radius, type, typeScale } from "../theme/tokens";
import { GlassSurface } from "./glass";
import { PressableScale } from "./motion";
import { useReduceMotion } from "./useReduceMotion";

function AppText({
  children,
  style,
  muted,
  max = typeScale.body,
  accessibilityRole,
}: {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  muted?: boolean;
  max?: number;
  accessibilityRole?: "header" | "text";
}) {
  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={max}
      accessibilityRole={accessibilityRole}
      style={[muted && { color: colors.muted }, style]}
    >
      {children}
    </Text>
  );
}

export function Card({
  children,
  style,
  padded = true,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}) {
  return (
    <GlassSurface style={style} padded={padded}>
      {children}
    </GlassSurface>
  );
}

export function Avatar({
  initials,
  size = 36,
}: {
  initials: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <AppText style={[styles.avatarText, { fontSize: size < 32 ? 11 : 13 }]} max={typeScale.ui}>
        {initials}
      </AppText>
    </View>
  );
}

export function AvatarGroup({ initials }: { initials: string[] }) {
  return (
    <View style={styles.avatarGroup}>
      {initials.slice(0, 4).map((item, index) => (
        <View key={`${item}-${index}`} style={{ marginLeft: index === 0 ? 0 : -8 }}>
          <Avatar initials={item} size={30} />
        </View>
      ))}
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <PressableScale
      disabled={disabled}
      haptic={variant === "primary" ? "success" : "light"}
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.button,
        variant === "primary" && styles.buttonPrimary,
        variant === "secondary" && styles.buttonSecondary,
        variant === "ghost" && styles.buttonGhost,
        variant === "danger" && styles.buttonDanger,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      <AppText
        max={typeScale.ui}
        style={[
          styles.buttonLabel,
          variant === "secondary" && { color: colors.ink },
          variant === "ghost" && { color: colors.clayDark },
          variant === "danger" && { color: colors.white },
        ]}
      >
        {label}
      </AppText>
    </PressableScale>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  tone = "clay",
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: "clay" | "sage";
}) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityState={{ selected: Boolean(selected) }}
      style={[styles.chip, selected ? (tone === "sage" ? styles.chipSage : styles.chipClay) : styles.chipIdle]}
    >
      <AppText max={typeScale.ui} style={[styles.chipLabel, selected && { color: colors.white }]}>
        {label}
      </AppText>
    </PressableScale>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <AppText style={styles.section}>{children}</AppText>;
}

export function Kicker({ children, clay }: { children: ReactNode; clay?: boolean }) {
  return <AppText style={[styles.kicker, clay && { color: colors.clay }]}>{children}</AppText>;
}

export function Body({
  children,
  muted,
  style,
}: {
  children: ReactNode;
  muted?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  return <AppText muted={muted} style={[styles.body, style]}>{children}</AppText>;
}

export function Title({ children }: { children: ReactNode }) {
  return (
    <AppText accessibilityRole="header" style={styles.title}>
      {children}
    </AppText>
  );
}

export function Display({ children }: { children: ReactNode }) {
  return (
    <AppText accessibilityRole="header" style={styles.display}>
      {children}
    </AppText>
  );
}

export function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.dots} accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: total, now: step + 1 }}>
      {Array.from({ length: total }).map((_, index) => (
        <Dot key={index} on={index <= step} />
      ))}
    </View>
  );
}

function Dot({ on }: { on: boolean }) {
  const reduce = useReduceMotion();
  const width = useSharedValue(on ? 18 : 7);

  useEffect(() => {
    width.value = reduce ? (on ? 18 : 7) : withSpring(on ? 18 : 7, motion.fluid);
  }, [on, reduce, width]);

  const animated = useAnimatedStyle(() => ({ width: width.value }));

  return <Animated.View style={[styles.dot, on && styles.dotOn, animated]} />;
}

export function ActionRow({
  primary,
  secondary,
}: {
  primary: ReactNode;
  secondary: ReactNode;
}) {
  return (
    <View style={styles.actionRow}>
      <View style={styles.actionSlot}>{primary}</View>
      <View style={styles.actionSlot}>{secondary}</View>
    </View>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <GlassSurface>
      <AppText style={styles.title}>{title}</AppText>
      <AppText muted style={[styles.body, { marginTop: 8 }]}>
        {body}
      </AppText>
      {action ? <View style={{ marginTop: 16 }}>{action}</View> : null}
    </GlassSurface>
  );
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { key: T; label: string }[];
  onChange: (key: T) => void;
}) {
  return (
    <GlassSurface padded={false} style={styles.segment}>
      <View style={styles.segmentRow}>
        {options.map((option) => (
          <PressableScale
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityLabel={option.label}
            accessibilityState={{ selected: value === option.key }}
            style={[styles.segmentItem, value === option.key && styles.segmentOn]}
          >
            <AppText max={typeScale.ui} style={[styles.segmentLabel, value === option.key && styles.segmentLabelOn]}>
              {option.label}
            </AppText>
          </PressableScale>
        ))}
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.sageLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },
  avatarText: { color: colors.sage, fontWeight: "700" },
  avatarGroup: { flexDirection: "row", alignItems: "center" },
  button: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  buttonPrimary: { backgroundColor: colors.clay },
  buttonSecondary: { backgroundColor: "rgba(255,255,255,0.55)" },
  buttonGhost: { backgroundColor: "transparent" },
  buttonDanger: { backgroundColor: colors.danger },
  buttonDisabled: { opacity: 0.4 },
  buttonLabel: { ...type.callout, color: colors.white },
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    justifyContent: "center",
  },
  chipIdle: { backgroundColor: "rgba(255,255,255,0.45)" },
  chipClay: { backgroundColor: colors.clay },
  chipSage: { backgroundColor: colors.sage },
  chipLabel: { ...type.callout, color: colors.muted },
  section: { ...type.caption, color: colors.muted, marginBottom: 8 },
  kicker: { ...type.kicker, color: colors.muted },
  body: { ...type.body, color: colors.ink },
  title: { ...type.title, color: colors.ink },
  display: { ...type.display, color: colors.ink },
  dots: { flexDirection: "row", gap: 6, alignItems: "center" },
  dot: {
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(36,31,28,0.15)",
  },
  dotOn: { backgroundColor: colors.clay },
  segment: { borderRadius: radius.pill },
  segmentRow: { flexDirection: "row", padding: 4, gap: 4 },
  segmentItem: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentOn: { backgroundColor: "rgba(255,255,255,0.86)" },
  segmentLabel: { color: colors.muted, fontWeight: "600" },
  segmentLabelOn: { color: colors.ink },
  actionRow: { flexDirection: "row", alignItems: "stretch", gap: 8 },
  actionSlot: { flex: 1 },
});
