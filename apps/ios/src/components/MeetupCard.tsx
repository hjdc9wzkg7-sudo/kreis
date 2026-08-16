import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { Easing, FadeIn } from "react-native-reanimated";

import { getUserById } from "../domain/data";
import {
  daysUntil,
  formatMeetupDate,
  hasMeetupEnded,
  hasMeetupStarted,
} from "../domain/matching";
import type { Meetup, RsvpStatus } from "../domain/types";
import { colors, space, type, typeScale } from "../theme/tokens";
import { PressableScale } from "./motion";
import { AvatarGroup, Button, Card } from "./ui";
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
  const myRsvp = meetup.rsvps[currentUserId] ?? "pending";
  const attending = Object.entries(meetup.rsvps).filter(([, status]) => status === "yes");
  const here = Object.entries(meetup.attendance ?? {}).filter(([, status]) => status === "here");
  const started = hasMeetupStarted(meetup);
  const ended = hasMeetupEnded(meetup);
  const iAmHere = meetup.attendance?.[currentUserId] === "here";
  const dateStr = formatMeetupDate(meetup.date, meetup.time);
  const when = daysUntil(meetup);
  const confirmed = myRsvp === "yes";

  return (
    <Card>
      <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.kicker}>
        {ended ? "Letztes Treffen" : `Nächstes Treffen · ${when}`}
      </Text>
      <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.title}>
        {meetup.title}
      </Text>
      <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.when}>
        {dateStr} · {meetup.time} Uhr
      </Text>

      <LocationBlock revealed={confirmed} location={meetup.location} />

      <View style={styles.row}>
        <AvatarGroup
          initials={attending
            .map(([id]) => getUserById(id)?.initials)
            .filter((value): value is string => Boolean(value))}
        />
        <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.hint}>
          {attending.length} zugesagt
          {started ? ` · ${here.length} wirklich da` : ""}
        </Text>
      </View>

      {!started && (
        <View style={styles.actionsCol}>
          <PressableScale
            haptic="success"
            onPress={() => onRsvp("yes")}
            accessibilityLabel={confirmed ? "Zugesagt. Treffpunkt ist sichtbar." : "Zusagen. Danach siehst du den Treffpunkt."}
            accessibilityState={{ selected: confirmed }}
            style={[
              styles.rsvpPrimary,
              myRsvp === "pending" && styles.rsvpPrimaryCta,
              confirmed && styles.rsvpConfirmed,
              (myRsvp === "maybe" || myRsvp === "no") && styles.rsvpPrimaryIdle,
            ]}
          >
            <Text
              allowFontScaling
              maxFontSizeMultiplier={typeScale.ui}
              style={[
                styles.rsvpPrimaryLabel,
                confirmed && styles.rsvpLabelOn,
                (myRsvp === "maybe" || myRsvp === "no") && styles.rsvpIdleLabel,
              ]}
            >
              {confirmed ? "Zugesagt" : "Zusagen"}
            </Text>
          </PressableScale>
          <View style={styles.actions}>
            <PressableScale
              haptic="light"
              onPress={() => onRsvp("maybe")}
              accessibilityLabel="Vielleicht"
              accessibilityState={{ selected: myRsvp === "maybe" }}
              style={[styles.rsvp, myRsvp === "maybe" && styles.rsvpMaybe]}
            >
              <Text
                allowFontScaling
                maxFontSizeMultiplier={typeScale.ui}
                style={[styles.rsvpLabel, myRsvp === "maybe" && styles.rsvpMaybeLabel]}
              >
                Vielleicht
              </Text>
            </PressableScale>
            <PressableScale
              haptic="light"
              onPress={() => onRsvp("no")}
              accessibilityLabel="Absagen"
              accessibilityState={{ selected: myRsvp === "no" }}
              style={[styles.rsvp, myRsvp === "no" && styles.rsvpNo]}
            >
              <Text
                allowFontScaling
                maxFontSizeMultiplier={typeScale.ui}
                style={[styles.rsvpLabel, myRsvp === "no" && styles.rsvpLabelOn]}
              >
                Absagen
              </Text>
            </PressableScale>
          </View>
        </View>
      )}

      {started && myRsvp === "yes" && !iAmHere && onCheckIn && (
        <Button label="Ich bin da" onPress={onCheckIn} style={{ marginTop: 16 }} />
      )}
      {iAmHere && (
        <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.here}>
          Du bist als da markiert.
        </Text>
      )}

      {isHost && !ended && onEdit && (
        <Button label="Termin ändern" variant="ghost" onPress={onEdit} style={{ marginTop: 8 }} />
      )}

      {isHost && started && (
        <View style={styles.hostList} accessibilityRole="summary">
          <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.hostTitle}>
            Wer war wirklich da?
          </Text>
          <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.hint}>
            Tippe den Namen: einmal = da, nochmal = nicht gekommen.
          </Text>
          {attending.map(([userId]) => {
            const user = getUserById(userId);
            const present = meetup.attendance?.[userId] === "here";
            const missed = meetup.attendance?.[userId] === "no_show";
            const name = user?.name ?? "Mitglied";
            return (
              <View key={userId} style={styles.hostPerson}>
                <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.hostName}>
                  {name}
                </Text>
                <View style={styles.hostToggles}>
                  <PressableScale
                    accessibilityLabel={`${name} als da markieren`}
                    accessibilityState={{ selected: present }}
                    haptic="success"
                    onPress={() => onSetAttendance?.(userId, "here")}
                    style={[styles.hostChip, present && styles.hostChipOn]}
                  >
                    <Text
                      allowFontScaling
                      maxFontSizeMultiplier={typeScale.ui}
                      style={[styles.hostChipText, present && styles.rsvpLabelOn]}
                    >
                      Da
                    </Text>
                  </PressableScale>
                  <PressableScale
                    accessibilityLabel={`${name} als nicht gekommen markieren`}
                    accessibilityState={{ selected: missed }}
                    onPress={() => onSetAttendance?.(userId, "no_show")}
                    style={[styles.hostChip, missed && styles.hostChipMiss]}
                  >
                    <Text
                      allowFontScaling
                      maxFontSizeMultiplier={typeScale.ui}
                      style={[styles.hostChipText, missed && styles.rsvpLabelOn]}
                    >
                      Nicht da
                    </Text>
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

function LocationBlock({ revealed, location }: { revealed: boolean; location: string }) {
  const reduce = useReduceMotion();
  const seen = useRef(revealed);
  const justOpened = revealed && !seen.current && !reduce;

  useEffect(() => {
    seen.current = revealed;
  }, [revealed]);

  if (revealed) {
    return (
      <Animated.View
        entering={justOpened ? FadeIn.duration(320).easing(Easing.out(Easing.cubic)) : undefined}
        style={[styles.place, styles.placeOpen]}
      >
        <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.placeLabel}>
          Ihr trefft euch hier
        </Text>
        <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.placeText}>
          {location}
        </Text>
      </Animated.View>
    );
  }

  return (
    <View style={styles.place}>
      <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.placeText}>
        Ort siehst du nach der Zusage
      </Text>
      <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.hint}>
        So bleibt der Treffpunkt nur bei der echten Runde.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kicker: { ...type.kicker, color: colors.coral, textTransform: "none", marginBottom: 6 },
  title: { ...type.hero, color: colors.ink },
  when: { marginTop: 6, color: colors.ink, fontWeight: "600", fontSize: type.subtitle.fontSize, lineHeight: type.subtitle.lineHeight },
  place: {
    marginTop: space.md,
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: 16,
    padding: 14,
  },
  placeOpen: {
    backgroundColor: colors.sageLight,
  },
  placeLabel: { ...type.kicker, color: colors.sage, textTransform: "none", marginBottom: 4 },
  placeText: { color: colors.ink, fontSize: type.callout.fontSize, lineHeight: type.callout.lineHeight, fontWeight: "600" },
  hint: { ...type.caption, color: colors.muted, marginTop: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: space.md },
  actionsCol: { marginTop: space.lg, gap: 8 },
  actions: { flexDirection: "row", gap: 8 },
  rsvpPrimary: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  rsvpPrimaryCta: { backgroundColor: colors.coral },
  rsvpConfirmed: { backgroundColor: colors.sage },
  rsvpPrimaryIdle: { backgroundColor: "rgba(255,255,255,0.4)" },
  rsvpPrimaryLabel: { fontWeight: "700", color: colors.white, fontSize: type.subtitle.fontSize },
  rsvpIdleLabel: { color: colors.ink },
  rsvp: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  rsvpMaybe: { backgroundColor: colors.creamDeep },
  rsvpMaybeLabel: { color: colors.ink, fontWeight: "700" },
  rsvpNo: { backgroundColor: colors.muted },
  rsvpLabel: { fontWeight: "600", color: colors.ink },
  rsvpLabelOn: { color: colors.white },
  here: { marginTop: 14, color: colors.sage, fontWeight: "600" },
  hostList: { marginTop: 16, gap: 10 },
  hostTitle: { fontWeight: "700", color: colors.ink, fontSize: type.subtitle.fontSize },
  hostPerson: { gap: 8 },
  hostName: { color: colors.ink, fontWeight: "600" },
  hostToggles: { flexDirection: "row", gap: 8 },
  hostChip: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  hostChipOn: { backgroundColor: colors.sage },
  hostChipMiss: { backgroundColor: colors.muted },
  hostChipText: { fontWeight: "600", color: colors.ink },
});
