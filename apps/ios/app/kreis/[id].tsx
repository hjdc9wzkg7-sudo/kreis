import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AfterEveningCard } from "@/src/components/AfterEveningCard";
import { SeasonBar } from "@/src/components/CircleCard";
import { Atmosphere } from "@/src/components/glass";
import { FormatGuideCard } from "@/src/components/FormatGuideCard";
import { MeetupCard } from "@/src/components/MeetupCard";
import { MomentFeed } from "@/src/components/MomentFeed";
import { ScheduleNextCard } from "@/src/components/ScheduleNextCard";
import { Avatar, Body, Button, Card, EmptyState, Kicker, SegmentedControl, Title } from "@/src/components/ui";
import { useTabScrollPadding } from "@/src/components/useTabScrollPadding";
import { formatLine } from "@/src/domain/copy";
import { getUserById } from "@/src/domain/data";
import {
  attendedMeetup,
  explainCircle,
  lastEndedMeetupForCircle,
  openSeatsLabel,
  seasonLine,
  upcomingMeetupForCircle,
} from "@/src/domain/matching";
import { leaveCircleScreen, normalizeParam, parseOrigin } from "@/src/navigation";
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

  const circle = state.circles.find((item) => item.id === id);
  const isMember = Boolean(circle && state.joinedCircleIds.includes(circle.id));
  const isHost = Boolean(circle && circle.hostId === state.currentUser.id);

  const goToOrigin = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    leaveCircleScreen(origin);
  }, [origin]);

  const leaveCircle = useCallback(() => {
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
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            dispatch({ type: "LEAVE_CIRCLE", circleId: circle.id });
            goToOrigin();
          },
        },
      ],
    );
  }, [circle, dispatch, goToOrigin, isHost]);

  const openMore = useCallback(() => {
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
  }, [circle, isHost, isMember, leaveCircle]);

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
          <Ionicons name="chevron-back" size={22} color={colors.coralDark} />
          <Text style={styles.backLabel}>Zurück</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={openMore}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Mehr Aktionen"
          style={styles.moreHit}
        >
          <Ionicons name="ellipsis-horizontal" size={22} color={colors.ink} />
        </Pressable>
      ),
    });
  }, [circle?.name, goToOrigin, navigation, openMore]);

  useEffect(() => {
    const sub = navigation.addListener("beforeRemove", (event) => {
      if (!origin || leaving.current) return;
      event.preventDefault();
      goToOrigin();
    });
    return sub;
  }, [goToOrigin, navigation, origin]);

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
          <Card tone="strong">
            <Kicker>{formatLine(circle.format, circle.neighborhood)}</Kicker>
            <Body muted style={styles.meta}>
              {isHost ? "Du führst diesen Kreis" : `Gastgeber:in ${circle.hostName}`}
            </Body>
            <Body style={styles.seats}>{openSeatsLabel(circle)}</Body>
            <Body muted style={styles.season}>
              {seasonLine(circle.season, true)}
            </Body>
            <Body muted style={styles.ritual}>Als Nächstes: {circle.season.ritual}</Body>
            <SeasonBar week={circle.season.weekNumber} total={circle.season.totalWeeks} />
            {!isMember && (
              <Button
                label="Dabei sein"
                haptic="success"
                onPress={() => dispatch({ type: "JOIN_CIRCLE", circleId: circle.id })}
                style={{ marginTop: space.md }}
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
                      rating: { meetupId: lastEnded.id, wouldRepeat },
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
                <Card tone="soft">
                  <Title style={styles.blockTitle}>
                    {lastEnded ? lastEnded.title : "Noch kein Termin"}
                  </Title>
                  <Body muted>
                    {isHost
                      ? "Leg das nächste Treffen fest."
                      : `${circle.hostName} plant das nächste Treffen.`}
                  </Body>
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
              <EmptyState
                kicker="Nur die Runde"
                title="Momente nur für Mitglieder"
                body="Wenn du dabei bist, kannst du der Gruppe einen Satz hinterlassen. Kein Feed."
              />
            ))}

          {tab === "info" && (
            <View style={{ gap: 12 }}>
              <FormatGuideCard format={circle.format} />
              <Card tone="soft">
                <Title style={styles.blockTitle}>Über diesen Kreis</Title>
                <Body muted>{circle.description}</Body>
              </Card>
              <Card tone="soft">
                <Title style={styles.blockTitle}>Mitglieder</Title>
                {members.map((member) => (
                  <View key={member.id} style={styles.member}>
                    <Avatar initials={member.initials} />
                    <View style={styles.memberCopy}>
                      <Body style={styles.memberName}>{member.name}</Body>
                      <Body muted style={styles.meta}>{member.intention.bio}</Body>
                    </View>
                  </View>
                ))}
              </Card>
              {why.length > 0 && (
                <Card tone="soft">
                  <Title style={styles.blockTitle}>Passt zu dir</Title>
                  {why.map((reason) => (
                    <Body key={reason} muted>
                      {reason}
                    </Body>
                  ))}
                </Card>
              )}
              {isMember && !isHost && (
                <Button label="Kreis verlassen" variant="danger" onPress={leaveCircle} />
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
  content: { padding: space.lg, gap: space.md },
  ritual: { marginTop: 4, marginBottom: 10 },
  seats: { marginTop: space.xs, fontWeight: "600" },
  season: { marginTop: 6, ...type.caption },
  meta: { marginTop: 6 },
  blockTitle: { marginBottom: 6 },
  member: { flexDirection: "row", gap: 10, alignItems: "center", marginTop: 10 },
  memberCopy: { flex: 1 },
  memberName: { fontWeight: "600" },
  moreHit: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
  backHit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingRight: 10,
  },
  backLabel: { color: colors.coralDark, fontSize: 17, fontWeight: "600" },
});
