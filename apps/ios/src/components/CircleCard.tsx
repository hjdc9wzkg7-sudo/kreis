import { StyleSheet, Text, View } from "react-native";

import { formatIcons, formatLabels, resolveFormat } from "../domain/copy";
import { getUserById } from "../domain/data";
import { openSeatsLabel } from "../domain/matching";
import type { Circle } from "../domain/types";
import { colors, space, type, typeScale } from "../theme/tokens";
import { PressableScale } from "./motion";
import { AvatarGroup, Button, Card } from "./ui";

export function SeasonBar({ week, total }: { week: number; total: number }) {
  const pct = Math.min(100, (week / total) * 100);
  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: week }}
    >
      <View style={[styles.fill, { width: `${pct}%` }]} />
    </View>
  );
}

export function CircleCard({
  circle,
  reasons,
  onPress,
  onJoin,
  onSkip,
}: {
  circle: Circle;
  reasons?: string[];
  onPress?: () => void;
  onJoin?: () => void;
  onSkip?: () => void;
}) {
  const members = circle.memberIds
    .map((id) => getUserById(id).initials)
    .filter(Boolean);
  const why = reasons?.[0];
  const hasActions = Boolean(onJoin || onSkip);

  const info = (
    <>
      <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.kicker}>
        {formatIcons[resolveFormat(circle.format)]} {formatLabels[resolveFormat(circle.format)]} · {circle.neighborhood}
      </Text>
      <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.name}>
        {circle.name}
      </Text>
      <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.body} numberOfLines={2}>
        {circle.description}
      </Text>
      <View style={styles.meta}>
        <AvatarGroup initials={members} />
        <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.metaText}>
          {openSeatsLabel(circle)}
        </Text>
      </View>
      {why ? (
        <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.why}>
          {why}
        </Text>
      ) : null}
    </>
  );

  return (
    <Card>
      {onPress ? (
        <PressableScale onPress={onPress} haptic="light" accessibilityLabel={circle.name}>
          {info}
        </PressableScale>
      ) : (
        info
      )}
      {hasActions && (
        <View style={styles.actions}>
          {onJoin && (
            <View style={{ flex: 1 }}>
              <Button label="Dabei sein" onPress={onJoin} />
            </View>
          )}
          {onSkip && (
            <View style={{ flex: 1 }}>
              <Button label="Andere Einladung" variant="secondary" onPress={onSkip} />
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  kicker: { ...type.caption, color: colors.muted, fontWeight: "600" },
  name: { marginTop: 6, ...type.hero, color: colors.ink },
  body: { marginTop: space.sm, color: colors.muted, ...type.callout, fontWeight: "400" },
  meta: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: space.md },
  metaText: { color: colors.ink, ...type.caption, flex: 1, fontWeight: "500" },
  why: { ...type.caption, color: colors.clay, marginTop: 10 },
  track: {
    height: 6,
    backgroundColor: "rgba(36,31,28,0.08)",
    borderRadius: 99,
    overflow: "hidden",
    marginTop: 8,
  },
  fill: { height: "100%", backgroundColor: colors.clay },
  actions: { flexDirection: "row", gap: 8, marginTop: space.md },
});
