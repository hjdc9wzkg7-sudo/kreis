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
  currentUserId,
}: {
  circle: Circle;
  reasons?: string[];
  onPress?: () => void;
  onJoin?: () => void;
  onSkip?: () => void;
  currentUserId?: string;
}) {
  const members = circle.memberIds
    .map((id) => getUserById(id).initials)
    .filter(Boolean);
  const why = reasons?.[0];
  const hasActions = Boolean(onJoin || onSkip);
  const leading = currentUserId && circle.hostId === currentUserId;

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
      {leading ? (
        <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.hostMark}>
          Du führst diesen Kreis
        </Text>
      ) : null}
      <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.season}>
        Woche {circle.season.weekNumber} von {circle.season.totalWeeks}
        {Math.max(0, circle.season.totalWeeks - circle.season.weekNumber) > 0
          ? ` · noch ${circle.season.totalWeeks - circle.season.weekNumber}`
          : " · letzte Woche"}
      </Text>
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
  hostMark: { ...type.caption, color: colors.sage, fontWeight: "700", marginTop: 10 },
  season: { ...type.caption, color: colors.muted, marginTop: 6 },
  why: { ...type.caption, color: colors.coral, marginTop: 6 },
  track: {
    height: 6,
    backgroundColor: "rgba(36,31,28,0.08)",
    borderRadius: 99,
    overflow: "hidden",
    marginTop: 8,
  },
  fill: { height: "100%", backgroundColor: colors.coral },
  actions: { flexDirection: "row", gap: 8, marginTop: space.md },
});
