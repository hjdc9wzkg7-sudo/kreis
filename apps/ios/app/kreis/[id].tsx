import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { leaveCircleScreen, normalizeParam, parseOrigin } from "@/src/navigation";

import { AfterEveningCard } from "@/src/components/AfterEveningCard";
import { SeasonBar } from "@/src/components/CircleCard";
import { Atmosphere } from "@/src/components/glass";
import { MeetupCard } from "@/src/components/MeetupCard";
import { MomentFeed } from "@/src/components/MomentFeed";
import { ScheduleNextCard } from "@/src/components/ScheduleNextCard";
import { Avatar, Button, Card, EmptyState, SegmentedControl } from "@/src/components/ui";
import { FormatGuideCard } from "@/src/components/FormatGuideCard";
import { formatIcons, formatLabels, resolveFormat } from "@/src/domain/copy";
import { getUserById } from "@/src/domain/data";
import {
  attendedMeetup,
  explainCircle,
  lastEndedMeetupForCircle,
  openSeatsLabel,
  upcomingMeetupForCircle,
} from "@/src/domain/matching";
import { useTabScrollPadding } from "@/src/components/useTabScrollPadding";
import { useApp } from "@/src/state/store";
import { colors, space, type } from "@/src/theme/tokens";

type Tab = "treffen" | "momente" | "info";

export default function CircleDetailScreen() {
  const params = useLocalSearchParams<{ id: string; from?: string | string[] }>();
  const id = normalizeParam(params.id);
  const origin = parseOrigin(params.from);
  const navigation = useNavigation();
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState<Tab>("treffen");
  const [editing, setEditing] = useState(false);
  const tabPad = useTabScrollPadding();
  const leaving = useRef(false);

  function goToOrigin() {
    if (leaving.current) return;
    leaving.current = true;
    leaveCircleScreen(origin);
  }

  const circle = state.circles.find((item) => item.id === id);
  const isMember = Boolean(circle && state.joinedCircleIds.includes(circle.id));
  const isHost = Boolean(circle && circle.hostId === state.currentUser.id);

  function leaveCircle() {
    if (!circle) return;
    if (isHost) {
      Alert.alert(
        "Du führst diesen Kreis",
        "Als Gastgeber:in kannst du die Runde nicht verlassen. Die anderen brauchen dich für den nächsten Termin.",
      );
      return;
    }
    Alert.alert(
      "Kreis verlassen?",
      `Du gehörst „${circle.name}“ danach nicht mehr. Den Treffpunkt und die Termine siehst du nicht mehr.`,
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Verlassen",
          style: "destructive",
          onPress: () => {
            dispatch({ type: "LEAVE_CIRCLE", circleId: circle.id });
            goToOrigin();
          },
        },
      ],
    );
  }

  function openMore() {
    if (!circle) return;
    Alert.alert(circle.name, undefined, [
      ...(isMember && !isHost
        ? [{ text: "Kreis verlassen", style: "destructive" as const, onPress: leaveCircle }]
        : []),
      {
        text: "Melden",
        onPress: () => router.push({ pathname: "/melden", params: { circleId: circle.id } }),
      },
      { text: "Abbrechen", style: "cancel" },
    ]);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: circle?.name ?? "Kreis",
      headerBackVisible: false,
      headerLeft: () => (
        <Pressable
          onPress={goToOrigin}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Zurück"
          style={styles.backHit}
        >
          <Ionicons name="chevron-back" size={22} color={colors.clayDark} />
          <Text style={styles.backLabel}>Zurück</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={openMore}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Mehr Aktionen"
          style={{ minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="ellipsis-horizontal" size={22} color={colors.ink} />
        </Pressable>
      ),
    });
  }, [circle?.name, origin, navigation]);

  useEffect(() => {
    const sub = navigation.addListener("beforeRemove", (event) => {
      if (!origin || leaving.current) return;
      event.preventDefault();
      goToOrigin();
    });
    return sub;
  }, [navigation, origin]);

  if (!circle) {
    return (
      <Atmosphere>
        <View style={[styles.safe, { padding: space.lg, justifyContent: "center" }]}>
          <EmptyState
            kicker="Nicht mehr da"
            title="Diesen Kreis gibt es nicht"
            body="Vielleicht wurde er aufgelöst — oder der Link stimmt nicht. Zurück, dann findest du deine Runden."
            action={<Button label="Zurück" onPress={goToOrigin} />}
          />
        </View>
      </Atmosphere>
    );
  }

  const upcoming = upcomingMeetupForCircle(state, circle.id);
  const lastEnded = lastEndedMeetupForCircle(state, circle.id);
  const moments = state.moments
    .filter((item) => item.circleId === circle.id)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  const members = circle.memberIds.map((uid) => getUserById(uid, state.currentUser));
  const why = explainCircle(state.currentUser, circle).reasons;
  const rated = lastEnded
    ? state.ratings.some((item) => item.meetupId === lastEnded.id)
    : false;
  const showRating =
    isMember && lastEnded && !upcoming && attendedMeetup(lastEnded, state.currentUser.id) && !rated;
  const showSchedule = isHost && !upcoming;

  return (
    <Atmosphere>
      <View collapsable={false} style={styles.safe}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: tabPad }]}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <Card>
            <Text style={styles.kicker}>
              {formatIcons[resolveFormat(circle.format)]} {formatLabels[resolveFormat(circle.format)]} · {circle.neighborhood}
            </Text>
            <Text style={styles.meta}>
              {isHost ? "Du führst diesen Kreis" : `Gastgeber:in ${circle.hostName}`}
            </Text>
            <Text style={styles.seats}>{openSeatsLabel(circle)}</Text>
            <Text style={styles.season}>
              Woche {circle.season.weekNumber} von {circle.season.totalWeeks}
              {Math.max(0, circle.season.totalWeeks - circle.season.weekNumber) > 0
                ? ` · noch ${circle.season.totalWeeks - circle.season.weekNumber} Treffen`
                : " · letzte Woche dieser Saison"}
            </Text>
            <Text style={styles.ritual}>Als Nächstes: {circle.season.ritual}</Text>
            <SeasonBar week={circle.season.weekNumber} total={circle.season.totalWeeks} />
            {!isMember && (
              <Button
                label="Dabei sein"
                onPress={() => dispatch({ type: "JOIN_CIRCLE", circleId: circle.id })}
                style={{ marginTop: 16 }}
              />
            )}
            {isMember && !isHost && (
              <Button
                label="Kreis verlassen"
                variant="ghost"
                onPress={leaveCircle}
                style={{ marginTop: 8 }}
              />
            )}
          </Card>

          <SegmentedControl
            value={tab}
            onChange={setTab}
            options={[
              { key: "treffen", label: "Treffen" },
              { key: "momente", label: "Momente" },
              { key: "info", label: "Info" },
            ]}
          />

          {tab === "treffen" && (
            <View style={{ gap: 12 }}>
              {upcoming && editing && isHost ? (
                <ScheduleNextCard
                  circle={circle}
                  meetup={upcoming}
                  onSave={(input) => {
                    dispatch({ type: "UPDATE_MEETUP", meetupId: upcoming.id, ...input });
                    setEditing(false);
                  }}
                  onCancel={() => setEditing(false)}
                />
              ) : upcoming ? (
                <MeetupCard
                  meetup={upcoming}
                  currentUserId={state.currentUser.id}
                  isHost={isHost}
                  onRsvp={(status) => dispatch({ type: "UPDATE_RSVP", meetupId: upcoming.id, status })}
                  onCheckIn={() => dispatch({ type: "CHECK_IN", meetupId: upcoming.id })}
                  onSetAttendance={(userId, status) =>
                    dispatch({ type: "SET_ATTENDANCE", meetupId: upcoming.id, userId, status })
                  }
                  onEdit={() => setEditing(true)}
                />
              ) : showRating && lastEnded ? (
                <AfterEveningCard
                  meetup={lastEnded}
                  circleName={circle.name}
                  onRate={(wouldRepeat) =>
                    dispatch({
                      type: "RATE_MEETUP",
                      rating: { meetupId: lastEnded.id, wouldRepeat, feltSafe: true },
                    })
                  }
                />
              ) : showSchedule ? (
                <ScheduleNextCard
                  circle={circle}
                  onSave={(input) =>
                    dispatch({
                      type: "SCHEDULE_NEXT_MEETUP",
                      circleId: circle.id,
                      ...input,
                    })
                  }
                />
              ) : (
                <Card>
                  <Text style={styles.blockTitle}>
                    {lastEnded ? lastEnded.title : "Noch kein Termin"}
                  </Text>
                  <Text style={styles.body}>
                    {isHost
                      ? "Leg das nächste Treffen fest."
                      : `${circle.hostName} plant das nächste Treffen.`}
                  </Text>
                </Card>
              )}
            </View>
          )}

          {tab === "momente" &&
            (isMember ? (
              <MomentFeed
                moments={moments}
                currentUserId={state.currentUser.id}
                onAdd={(content) => dispatch({ type: "ADD_MOMENT", circleId: circle.id, content })}
              />
            ) : (
              <Text style={styles.empty}>Momente nur für Mitglieder.</Text>
            ))}

          {tab === "info" && (
            <View style={{ gap: 12 }}>
              <FormatGuideCard format={circle.format} />
              <Card>
                <Text style={styles.blockTitle}>Über diesen Kreis</Text>
                <Text style={styles.body}>{circle.description}</Text>
              </Card>
              <Card>
                <Text style={styles.blockTitle}>Mitglieder</Text>
                {members.map((member) => (
                  <View key={member.id} style={styles.member}>
                    <Avatar initials={member.initials} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.meta}>{member.intention.bio}</Text>
                    </View>
                  </View>
                ))}
              </Card>
              {why.length > 0 && (
                <Card>
                  <Text style={styles.blockTitle}>Passt zu dir</Text>
                  {why.map((reason) => (
                    <Text key={reason} style={styles.body}>
                      {reason}
                    </Text>
                  ))}
                </Card>
              )}
              {isMember && !isHost && (
                <Button label="Kreis verlassen" variant="secondary" onPress={leaveCircle} />
              )}
              {isMember && (
                <Button
                  label="Melden"
                  variant="ghost"
                  onPress={() => router.push({ pathname: "/melden", params: { circleId: circle.id } })}
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: space.lg, gap: 16 },
  kicker: { ...type.caption, color: colors.muted, fontWeight: "600" },
  ritual: { ...type.callout, fontWeight: "400", color: colors.muted, marginTop: 4, marginBottom: 10 },
  seats: { ...type.callout, color: colors.ink, marginTop: 8 },
  season: { ...type.caption, color: colors.muted, marginTop: 6 },
  meta: { ...type.callout, fontWeight: "400", color: colors.muted, marginTop: 6 },
  blockTitle: { ...type.subtitle, fontWeight: "600", color: colors.ink, marginBottom: 6 },
  body: { ...type.body, color: colors.muted },
  member: { flexDirection: "row", gap: 10, alignItems: "center", marginTop: 10 },
  memberName: { fontWeight: "600", color: colors.ink },
  empty: { color: colors.muted, textAlign: "center", padding: 24 },
  backHit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingRight: 10,
  },
  backLabel: { color: colors.clayDark, fontSize: 17, fontWeight: "600" },
});
