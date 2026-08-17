import { ReactNode, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { colors, motion, radius, space, type, typeScale } from "../theme/tokens";
import { GlassSurface, type GlassTone } from "./glass";
import { Enter, PressableScale } from "./motion";
import { useReduceMotion } from "./useReduceMotion";

function AppText({
  children,
  style,
  muted,
  max = typeScale.body,
  accessibilityRole,
  numberOfLines,
}: {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  muted?: boolean;
  max?: number;
  accessibilityRole?: "header" | "text";
  numberOfLines?: number;
}) {
  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={max}
      accessibilityRole={accessibilityRole}
      numberOfLines={numberOfLines}
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
  delay = 0,
  tone = "regular",
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  delay?: number;
  tone?: GlassTone;
}) {
  return (
    <Enter delay={delay} style={style}>
      <GlassSurface style={style} padded={padded} tone={tone}>
        {children}
      </GlassSurface>
    </Enter>
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
  haptic,
}: {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  haptic?: "light" | "success" | "medium" | "warning" | "none";
}) {
  const resolvedHaptic = haptic ?? (variant === "primary" ? "medium" : "light");
  return (
    <PressableScale
      disabled={disabled}
      haptic={resolvedHaptic}
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
          variant === "ghost" && { color: colors.coralDark },
          variant === "danger" && { color: colors.danger },
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
  const selectedStyle = selected
    ? tone === "sage"
      ? styles.chipSage
      : styles.chipClay
    : styles.chipIdle;
  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityState={{ selected: Boolean(selected) }}
      style={[styles.chip, selectedStyle]}
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

export function Kicker({
  children,
  clay,
  style,
}: {
  children: ReactNode;
  clay?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  return <AppText style={[styles.kicker, clay && { color: colors.coral }, style]}>{children}</AppText>;
}

export function Body({
  children,
  muted,
  style,
  numberOfLines,
}: {
  children: ReactNode;
  muted?: boolean;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  return (
    <AppText muted={muted} numberOfLines={numberOfLines} style={[styles.body, style]}>
      {children}
    </AppText>
  );
}

export function Title({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return (
    <AppText accessibilityRole="header" style={[styles.title, style]}>
      {children}
    </AppText>
  );
}

export function Display({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return (
    <AppText accessibilityRole="header" style={[styles.display, style]}>
      {children}
    </AppText>
  );
}

export function ScreenIntro({
  kicker,
  title,
  display,
  body,
}: {
  kicker?: string;
  title?: string;
  display?: string;
  body?: string;
}) {
  return (
    <View style={styles.intro}>
      {kicker ? <Kicker clay>{kicker}</Kicker> : null}
      {display ? <Display>{display}</Display> : title ? <Title>{title}</Title> : null}
      {body ? <Body muted>{body}</Body> : null}
    </View>
  );
}

export function LoadingState({ body = "Einen Moment — wir holen deinen Stand." }: { body?: string }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.coral} />
      <Body muted>{body}</Body>
    </View>
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
      <View style={styles.actionPrimary}>{primary}</View>
      <View style={styles.actionSecondary}>{secondary}</View>
    </View>
  );
}

export function EmptyState({
  title,
  body,
  action,
  kicker = "Alles ruhig",
}: {
  title: string;
  body: string;
  action?: ReactNode;
  kicker?: string;
}) {
  return (
    <Enter>
      <GlassSurface tone="soft">
        <View style={styles.emptyGlyph} accessibilityElementsHidden>
          <View style={styles.emptyRing} />
          <View style={styles.emptyCore} />
        </View>
        <AppText style={[styles.kicker, { color: colors.coral }]}>{kicker}</AppText>
        <AppText style={[styles.title, { marginTop: space.xs }]}>{title}</AppText>
        <AppText muted style={[styles.body, { marginTop: space.xs }]}>
          {body}
        </AppText>
        {action ? <View style={{ marginTop: space.md }}>{action}</View> : null}
      </GlassSurface>
    </Enter>
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
    <GlassSurface padded={false} tone="strong" style={styles.segment}>
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

export const fieldStyle = {
  backgroundColor: colors.glass,
  borderRadius: radius.md,
  paddingHorizontal: space.md,
  paddingVertical: space.md,
  color: colors.ink,
  fontSize: type.body.fontSize,
  lineHeight: type.body.lineHeight,
} as const;

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.peach,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },
  avatarText: { color: colors.coralDark, fontWeight: "700" },
  avatarGroup: { flexDirection: "row", alignItems: "center" },
  button: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.md,
  },
  buttonPrimary: {
    backgroundColor: colors.coral,
    shadowColor: colors.coralDark,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  buttonSecondary: { backgroundColor: colors.glass },
  buttonGhost: { backgroundColor: "transparent" },
  buttonDanger: { backgroundColor: colors.dangerSoft },
  buttonDisabled: { opacity: 0.4 },
  buttonLabel: { ...type.callout, color: colors.white },
  chip: {
    minHeight: 44,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.pill,
    justifyContent: "center",
  },
  chipIdle: { backgroundColor: colors.glassSoft },
  chipClay: { backgroundColor: colors.coral },
  chipSage: { backgroundColor: colors.sage },
  chipLabel: { ...type.callout, color: colors.muted },
  section: { ...type.caption, color: colors.muted, marginBottom: space.xs },
  kicker: { ...type.kicker, color: colors.muted },
  body: { ...type.body, color: colors.ink },
  title: { ...type.title, color: colors.ink },
  display: { ...type.display, color: colors.ink },
  intro: { gap: 6 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: space.sm, padding: space.lg },
  dots: { flexDirection: "row", gap: 6, alignItems: "center" },
  dot: {
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(36,31,28,0.15)",
  },
  dotOn: { backgroundColor: colors.coral },
  segment: { borderRadius: radius.pill },
  segmentRow: { flexDirection: "row", padding: 4, gap: 4 },
  segmentItem: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentOn: { backgroundColor: colors.glassStrong },
  segmentLabel: { color: colors.muted, fontWeight: "600" },
  segmentLabelOn: { color: colors.ink },
  actionRow: { flexDirection: "row", alignItems: "stretch", gap: space.xs },
  actionPrimary: { flex: 1.45 },
  actionSecondary: { flex: 1 },
  emptyGlyph: {
    width: 36,
    height: 36,
    marginBottom: space.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(227,106,74,0.28)",
  },
  emptyCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(227,106,74,0.35)",
  },
});
