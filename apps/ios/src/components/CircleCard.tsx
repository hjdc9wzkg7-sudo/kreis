import { StyleSheet, View } from "react-native";

import { formatIcons, formatLabels, resolveFormat } from "../domain/copy";
import { getUserById } from "../domain/data";
import { openSeatsLabel } from "../domain/matching";
import type { Circle } from "../domain/types";
import { colors, space } from "../theme/tokens";
import { PressableScale } from "./motion";
import { AvatarGroup, Body, Button, Card, Kicker, Title } from "./ui";

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
  delay = 0,
}: {
  circle: Circle;
  reasons?: string[];
  onPress?: () => void;
  onJoin?: () => void;
  onSkip?: () => void;
  currentUserId?: string;
  delay?: number;
}) {
  const members = circle.memberIds
    .map((id) => getUserById(id).initials)
    .filter(Boolean);
  const why = reasons?.[0];
  const hasActions = Boolean(onJoin || onSkip);
  const leading = currentUserId && circle.hostId === currentUserId;

  const info = (
    <>
      <Kicker>
        {formatIcons[resolveFormat(circle.format)]} {formatLabels[resolveFormat(circle.format)]} · {circle.neighborhood}
      </Kicker>
      <Title style={styles.name}>{circle.name}</Title>
      <Body muted style={styles.body} numberOfLines={2}>
        {circle.description}
      </Body>
      <View style={styles.meta}>
        <AvatarGroup initials={members} />
        <Body style={styles.metaText}>{openSeatsLabel(circle)}</Body>
      </View>
      {leading ? (
        <Body style={styles.hostMark}>Du führst diesen Kreis</Body>
      ) : null}
      <Body muted style={styles.season}>
        Woche {circle.season.weekNumber} von {circle.season.totalWeeks}
        {Math.max(0, circle.season.totalWeeks - circle.season.weekNumber) > 0
          ? ` · noch ${circle.season.totalWeeks - circle.season.weekNumber}`
          : " · letzte Woche"}
      </Body>
      {why ? <Body style={styles.why}>{why}</Body> : null}
    </>
  );

  return (
    <Card delay={delay}>
      {onPress ? (
        <PressableScale
          onPress={onPress}
          haptic="light"
          pressedScale={0.985}
          accessibilityLabel={circle.name}
        >
          {info}
        </PressableScale>
      ) : (
        info
      )}
      {hasActions && (
        <View style={styles.actions}>
          {onJoin ? <Button label="Dabei sein" haptic="success" onPress={onJoin} /> : null}
          {onSkip ? <Button label="Andere Einladung" variant="ghost" onPress={onSkip} /> : null}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  name: { marginTop: 6 },
  body: { marginTop: space.sm },
  meta: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: space.md },
  metaText: { flex: 1, fontSize: 13, lineHeight: 17, fontWeight: "500" },
  hostMark: { color: colors.sage, fontWeight: "600", marginTop: 10, fontSize: 13, lineHeight: 17 },
  season: { marginTop: 6, fontSize: 13, lineHeight: 17 },
  why: { color: colors.coral, marginTop: 6, fontSize: 13, lineHeight: 17, fontWeight: "500" },
  track: {
    height: 6,
    backgroundColor: "rgba(36,31,28,0.08)",
    borderRadius: 99,
    overflow: "hidden",
    marginTop: space.xs,
  },
  fill: { height: "100%", backgroundColor: colors.coral },
  actions: { gap: space.xs, marginTop: space.md },
});
