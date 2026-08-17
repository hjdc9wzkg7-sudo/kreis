import { StyleSheet, View } from "react-native";

import { formatLine } from "../domain/copy";
import { getUserById } from "../domain/data";
import { openSeatsLabel, seasonLine } from "../domain/matching";
import type { Circle } from "../domain/types";
import { useApp } from "../state/store";
import { colors, motion, space, type } from "../theme/tokens";
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
  const { state } = useApp();
  const members = circle.memberIds
    .map((id) => getUserById(id, state.currentUser).initials)
    .filter(Boolean);
  const why = reasons?.[0];
  const hasActions = Boolean(onJoin || onSkip);
  const leading = currentUserId && circle.hostId === currentUserId;

  const info = (
    <>
      <Kicker>{formatLine(circle.format, circle.neighborhood)}</Kicker>
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
        {seasonLine(circle.season)}
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
          pressedScale={motion.cardScale}
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
  metaText: { flex: 1, ...type.caption },
  hostMark: { color: colors.sage, fontWeight: "600", marginTop: 10, ...type.caption },
  season: { marginTop: 6, ...type.caption },
  why: { color: colors.coral, marginTop: 6, ...type.caption },
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
