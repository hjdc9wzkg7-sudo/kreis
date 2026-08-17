import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { getUserById } from "../domain/data";
import {
  daysUntil,
  formatMeetupDate,
  hasMeetupEnded,
  hasMeetupStarted,
} from "../domain/matching";
import type { Meetup, RsvpStatus } from "../domain/types";
import { useApp } from "../state/store";
import { colors, space, type } from "../theme/tokens";
import { PressableScale } from "./motion";
import { AvatarGroup, Body, Button, Card, Kicker, Title } from "./ui";
import { useReduceMotion } from "./useReduceMotion";

export function MeetupCard({
  meetup,
  currentUserId,
  isHost,
  onRsvp,
  onCheckIn,
  onSetAttendance,
  onEdit,
}: {
  meetup: Meetup;
  currentUserId: string;
  isHost?: boolean;
  onRsvp: (status: RsvpStatus) => void;
  onCheckIn?: () => void;
  onSetAttendance?: (userId: string, status: "here" | "no_show") => void;
  onEdit?: () => void;
}) {
  const { state } = useApp();
  const myRsvp = meetup.rsvps[currentUserId] ?? "pending";
  const attending = Object.entries(meetup.rsvps).filter(([, status]) => status === "yes");
  const here = Object.entries(meetup.attendance ?? {}).filter(([, status]) => status === "here");
  const started = hasMeetupStarted(meetup);
  const ended = hasMeetupEnded(meetup);
  const iAmHere = meetup.attendance?.[currentUserId] === "here";
  const dateStr = formatMeetupDate(meetup.date, meetup.time);
  const when = daysUntil(meetup);
  const confirmed = myRsvp === "yes";
  const lookup = (id: string) => getUserById(id, state.currentUser);

  return (
    <Card>
      <Kicker clay>
        {ended ? "Letztes Treffen" : `Nächstes Treffen · ${when}`}
        {isHost ? " · Du führst" : ""}
      </Kicker>
      <Title style={styles.title}>{meetup.title}</Title>
      <Body style={styles.when}>
        {dateStr} · {meetup.time} Uhr
      </Body>

      <LocationBlock revealed={confirmed} location={meetup.location} hint={meetup.locationHint} />

      <View style={styles.row}>
        <AvatarGroup
          initials={attending
            .map(([id]) => lookup(id).initials)
            .filter(Boolean)}
        />
        <Body muted style={styles.hint}>
          {attending.length === 0
            ? "Noch niemand fest zugesagt"
            : attending.map(([id]) => lookup(id).name).join(", ")}
          {started ? ` · ${here.length} wirklich da` : ""}
        </Body>
      </View>

      {!started && (
        <View style={styles.actionsCol}>
          <Button
            label={confirmed ? "Zugesagt" : "Zusagen"}
            variant={confirmed ? "secondary" : "primary"}
            haptic={confirmed ? "light" : "success"}
            onPress={() => onRsvp("yes")}
          />
          <View style={styles.actions}>
            <View style={styles.actionHalf}>
              <Button
                label="Vielleicht"
                variant={myRsvp === "maybe" ? "secondary" : "ghost"}
                onPress={() => onRsvp("maybe")}
              />
            </View>
            <View style={styles.actionHalf}>
              <Button
                label="Absagen"
                variant={myRsvp === "no" ? "secondary" : "ghost"}
                onPress={() => onRsvp("no")}
              />
            </View>
          </View>
          <Body muted style={styles.stand}>
            {myRsvp === "yes"
              ? "Dein Stand: zugesagt"
              : myRsvp === "maybe"
                ? "Dein Stand: vielleicht"
                : myRsvp === "no"
                  ? "Dein Stand: abgesagt"
                  : "Dein Stand: noch offen"}
          </Body>
        </View>
      )}

      {started && myRsvp === "yes" && !iAmHere && onCheckIn && (
        <Button label="Ich bin da" haptic="success" onPress={onCheckIn} style={styles.checkIn} />
      )}
      {iAmHere && (
        <Body style={styles.here}>Du bist als da markiert.</Body>
      )}

      {isHost && !ended && onEdit && (
        <Button label="Termin ändern" variant="ghost" onPress={onEdit} style={styles.edit} />
      )}

      {isHost && started && (
        <View style={styles.hostList} accessibilityRole="summary">
          <Title style={styles.hostTitle}>Wer war wirklich da?</Title>
          <Body muted style={styles.hint}>
            Markiere für jede zugesagte Person, ob sie da war.
          </Body>
          {attending.map(([userId]) => {
            const user = lookup(userId);
            const present = meetup.attendance?.[userId] === "here";
            const missed = meetup.attendance?.[userId] === "no_show";
            const name = user?.name ?? "Mitglied";
            return (
              <View key={userId} style={styles.hostPerson}>
                <Body style={styles.hostName}>{name}</Body>
                <View style={styles.hostToggles}>
                  <PressableScale
                    accessibilityLabel={`${name} als da markieren`}
                    accessibilityState={{ selected: present }}
                    haptic="success"
                    onPress={() => onSetAttendance?.(userId, "here")}
                    style={[styles.hostChip, present && styles.hostChipOn]}
                  >
                    <Body style={[styles.hostChipText, present && styles.hostChipTextOn]}>Da</Body>
                  </PressableScale>
                  <PressableScale
                    accessibilityLabel={`${name} als nicht gekommen markieren`}
                    accessibilityState={{ selected: missed }}
                    onPress={() => onSetAttendance?.(userId, "no_show")}
                    style={[styles.hostChip, missed && styles.hostChipMiss]}
                  >
                    <Body style={[styles.hostChipText, missed && styles.hostChipTextOn]}>Nicht da</Body>
                  </PressableScale>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
}

function LocationBlock({
  revealed,
  location,
  hint,
}: {
  revealed: boolean;
  location: string;
  hint: string;
}) {
  const reduce = useReduceMotion();
  const seen = useRef(revealed);
  const justOpened = revealed && !seen.current && !reduce;

  useEffect(() => {
    seen.current = revealed;
  }, [revealed]);

  if (revealed) {
    return (
      <Animated.View
        entering={justOpened ? FadeIn.springify().damping(22).stiffness(180) : undefined}
        style={[styles.place, styles.placeOpen]}
      >
        <Kicker style={styles.placeLabel}>Ihr trefft euch hier</Kicker>
        <Body style={styles.placeText}>{location}</Body>
      </Animated.View>
    );
  }

  return (
    <View style={styles.place}>
      <Body style={styles.placeText}>Ort siehst du nach der Zusage</Body>
      <Body muted style={styles.hint}>
        {hint}
      </Body>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 4 },
  when: { marginTop: 6, fontWeight: "600" },
  place: {
    marginTop: space.md,
    backgroundColor: colors.glassSoft,
    borderRadius: 16,
    padding: space.sm,
  },
  placeOpen: {
    backgroundColor: colors.sageLight,
  },
  placeLabel: { color: colors.sage, marginBottom: 4 },
  placeText: { fontWeight: "600" },
  hint: { marginTop: 4, ...type.caption },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: space.md },
  actionsCol: { marginTop: space.lg, gap: space.xs },
  actions: { flexDirection: "row", gap: space.xs },
  actionHalf: { flex: 1 },
  checkIn: { marginTop: space.md },
  edit: { marginTop: space.xs },
  stand: { marginTop: 4, color: colors.coral, ...type.caption },
  here: { marginTop: space.sm, color: colors.sage, fontWeight: "600" },
  hostList: { marginTop: space.md, gap: 10 },
  hostTitle: { marginBottom: 4 },
  hostPerson: { gap: space.xs },
  hostName: { fontWeight: "600" },
  hostToggles: { flexDirection: "row", gap: space.xs },
  hostChip: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glassSoft,
  },
  hostChipOn: { backgroundColor: colors.sage },
  hostChipMiss: { backgroundColor: colors.muted },
  hostChipText: { fontWeight: "600", fontSize: 15, lineHeight: 20 },
  hostChipTextOn: { color: colors.white },
});
