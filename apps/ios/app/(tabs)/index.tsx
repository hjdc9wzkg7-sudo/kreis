import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AfterEveningCard } from "@/src/components/AfterEveningCard";
import { CircleCard } from "@/src/components/CircleCard";
import { Atmosphere } from "@/src/components/glass";
import { MeetupCard } from "@/src/components/MeetupCard";
import { PressableScale } from "@/src/components/motion";
import { ScheduleNextCard } from "@/src/components/ScheduleNextCard";
import { Body, Button, EmptyState, Kicker, Title } from "@/src/components/ui";
import { paceLabels } from "@/src/domain/copy";
import { useScreenPadding } from "@/src/components/useTabScrollPadding";
import { daysUntil, getJoinedCircles, greeting, homePhase, intentionPace } from "@/src/domain/matching";
import { openCircle } from "@/src/navigation";
import { useApp } from "@/src/state/store";
import { colors, space, type } from "@/src/theme/tokens";

export default function TodayScreen() {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState(false);
  const joined = getJoinedCircles(state);
  const phase = homePhase(state);
  const pace = intentionPace(state.currentUser);

  function join(id: string) {
    dispatch({ type: "JOIN_CIRCLE", circleId: id });
    openCircle(id, "heute");
  }

  const screenPad = useScreenPadding();
  const intro =
    phase.kind === "upcoming"
      ? `${phase.circle.name} · ${daysUntil(phase.meetup)}`
      : phase.kind === "rate"
        ? `Wie war ${phase.circle.name}?`
        : phase.kind === "schedule"
          ? "Nächstes Treffen festlegen."
          : phase.kind === "waiting"
            ? `${phase.circle.hostName} plant das nächste Treffen.`
            : phase.kind === "invite"
              ? "Eine Einladung für dich."
              : "Heute nichts Offenes.";

  return (
    <Atmosphere>
      <View collapsable={false} style={styles.safe}>
        <ScrollView
          contentContainerStyle={[styles.content, screenPad]}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Kicker clay>
              Demo · {paceLabels[pace]} · {state.currentUser.intention.neighborhood}
            </Kicker>
            <Title>{greeting(state.currentUser.name)}</Title>
            <Body muted style={styles.sub}>
              {intro}
            </Body>
          </View>

          {!state.sawHomeHint && phase.kind === "invite" && (
            <PressableScale
              haptic="light"
              accessibilityLabel="Hinweis schließen"
              onPress={() => dispatch({ type: "DISMISS_HOME_HINT" })}
              style={styles.hintStrip}
            >
              <Text style={styles.hintText}>Sag zu — mehr musst du heute nicht. Tippen zum Schließen.</Text>
            </PressableScale>
          )}

          {phase.kind === "upcoming" && (
            <View style={styles.hero}>
              {editing && phase.circle.hostId === state.currentUser.id ? (
                <ScheduleNextCard
                  circle={phase.circle}
                  meetup={phase.meetup}
                  onSave={(input) => {
                    dispatch({ type: "UPDATE_MEETUP", meetupId: phase.meetup.id, ...input });
                    setEditing(false);
                  }}
                  onCancel={() => setEditing(false)}
                />
              ) : (
                <MeetupCard
                  meetup={phase.meetup}
                  currentUserId={state.currentUser.id}
                  isHost={phase.circle.hostId === state.currentUser.id}
                  onRsvp={(status) =>
                    dispatch({ type: "UPDATE_RSVP", meetupId: phase.meetup.id, status })
                  }
                  onCheckIn={() => dispatch({ type: "CHECK_IN", meetupId: phase.meetup.id })}
                  onSetAttendance={(userId, status) =>
                    dispatch({
                      type: "SET_ATTENDANCE",
                      meetupId: phase.meetup.id,
                      userId,
                      status,
                    })
                  }
                  onEdit={() => setEditing(true)}
                />
              )}
              <Button
                label={`Zu ${phase.circle.name}`}
                variant="ghost"
                onPress={() => openCircle(phase.circle.id, "heute")}
              />
            </View>
          )}

          {phase.kind === "rate" && (
            <View style={styles.hero}>
              <AfterEveningCard
                meetup={phase.meetup}
                circleName={phase.circle.name}
                wouldRepeat={state.ratings.find((item) => item.meetupId === phase.meetup.id)?.wouldRepeat}
                onRate={(wouldRepeat) =>
                  dispatch({
                    type: "RATE_MEETUP",
                    rating: { meetupId: phase.meetup.id, wouldRepeat, feltSafe: true },
                  })
                }
              />
              <Button
                label={`Zu ${phase.circle.name}`}
                variant="ghost"
                onPress={() => openCircle(phase.circle.id, "heute")}
              />
            </View>
          )}

          {phase.kind === "schedule" && (
            <View style={styles.hero}>
              <ScheduleNextCard
                circle={phase.circle}
                onSave={(input) =>
                  dispatch({
                    type: "SCHEDULE_NEXT_MEETUP",
                    circleId: phase.circle.id,
                    ...input,
                  })
                }
              />
            </View>
          )}

          {phase.kind === "waiting" && (
            <EmptyState
              kicker="Kurze Pause"
              title={`${phase.circle.name} atmet durch`}
              body={`${phase.circle.hostName} legt das nächste Treffen fest. Bis dahin darfst du warten — oder eine neue Einladung ansehen.`}
              action={
                <Button label="Einladungen ansehen" variant="secondary" onPress={() => router.push("/(tabs)/entdecken")} />
              }
            />
          )}

          {phase.kind === "invite" && (
            <View style={styles.hero}>
              {phase.last?.meetup && (
                <Text style={styles.memory}>
                  Schön, dass du bei {phase.last.circle.name} warst. Als Nächstes:
                </Text>
              )}
              <CircleCard
                circle={phase.suggestion.circle}
                reasons={phase.suggestion.reasons}
                onPress={() => openCircle(phase.suggestion.circle.id, "heute")}
                onJoin={() => join(phase.suggestion.circle.id)}
              />
            </View>
          )}

          {phase.kind === "pause" && (
            <EmptyState
              kicker="Heute frei"
              title="Heute darfst du Pause machen"
              body={
                joined.length > 0
                  ? "Kein offener Termin — das ist in Ordnung. Deine Kreise sind trotzdem da."
                  : "Unter Entdecken wartet vielleicht eine Einladung, die sich leicht anfühlt."
              }
              action={
                <Button
                  label={joined.length > 0 ? "Meine Kreise" : "Einladungen ansehen"}
                  variant="secondary"
                  onPress={() => router.push(joined.length > 0 ? "/(tabs)/kreise" : "/(tabs)/entdecken")}
                />
              }
            />
          )}
        </ScrollView>
      </View>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {},
  intro: { gap: 6 },
  sub: { marginTop: 2 },
  hero: { gap: 8 },
  hintStrip: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  hintText: { ...type.caption, color: colors.muted },
  memory: { ...type.callout, color: colors.coral, lineHeight: 22 },
});
