import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { CircleCard } from "@/src/components/CircleCard";
import { Atmosphere, GlassSurface } from "@/src/components/glass";
import { PressableScale } from "@/src/components/motion";
import { Avatar, Body, Button, Card, EmptyState, Kicker, ScreenIntro, SectionLabel, Title } from "@/src/components/ui";
import { formatLabels, paceLabels, resolveFormat } from "@/src/domain/copy";
import { hostedCircleNeedingSchedule, hostedCircles, intentionPace } from "@/src/domain/matching";
import { useScreenPadding } from "@/src/components/useTabScrollPadding";
import { getReputation } from "@/src/domain/trust";
import { openCircle } from "@/src/navigation";
import { useApp } from "@/src/state/store";
import { colors, radius, space, type } from "@/src/theme/tokens";

export default function ProfileScreen() {
  const { state, dispatch } = useApp();
  const reputation = getReputation(state);
  const { intention } = state.currentUser;
  const screenPad = useScreenPadding();
  const empty = reputation.guestCircles.length === 0 && reputation.hostedCircles.length === 0;

  return (
    <Atmosphere>
      <View collapsable={false} style={styles.safe}>
        <ScrollView
          contentContainerStyle={[styles.content, screenPad]}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.top}>
            <View style={{ flex: 1 }}>
              <ScreenIntro kicker="Profil · Demo" display={state.currentUser.name} />
            </View>
            <PressableScale
              accessibilityLabel="Einstellungen"
              onPress={() => router.push("/(tabs)/profil/einstellungen" as Href)}
            >
              <GlassSurface tone="soft" padded={false} style={styles.gear}>
                <Ionicons name="settings-outline" size={22} color={colors.ink} />
              </GlassSurface>
            </PressableScale>
          </View>

          <Card tone="strong">
            <View style={styles.identity}>
              <Avatar initials={state.currentUser.initials} size={64} />
              <View style={{ flex: 1 }}>
                <Title style={styles.place}>{intention.neighborhood}</Title>
                <Body muted style={styles.bio}>{intention.bio}</Body>
              </View>
            </View>
            <View style={styles.tags}>
              {intention.formats.map((format) => (
                <View key={format} style={styles.tag}>
                  <Body style={styles.tagText}>{formatLabels[resolveFormat(format)]}</Body>
                </View>
              ))}
            </View>
          </Card>

          <Card tone="soft">
            <SectionLabel>Was zu dir passt</SectionLabel>
            <Title style={styles.place}>{paceLabels[intentionPace(state.currentUser)]}</Title>
            <Body muted style={styles.bio}>
              {intention.neighborhood} · {intention.formats.map((item) => formatLabels[resolveFormat(item)]).join(", ")}
            </Body>
            <Button
              label="Anpassen"
              variant="ghost"
              onPress={() => router.push("/(tabs)/profil/einstellungen" as Href)}
            />
          </Card>

          <SectionLabel>So kennt dich dein Kreis</SectionLabel>
          <View style={styles.marks}>
            {reputation.marks.map((mark) => (
              <View
                key={mark.id}
                style={[styles.mark, mark.earned ? styles.markOn : styles.markOff]}
                accessibilityRole="text"
                accessibilityLabel={`${mark.title}. ${mark.hint}${mark.earned ? " Erreicht." : " Noch nicht."}`}
              >
                <Kicker style={mark.earned ? styles.markTitleOn : styles.markTitleOff}>
                  {mark.earned ? `✓  ${mark.title}` : mark.title}
                </Kicker>
                <Body muted style={styles.markHint}>{mark.hint}</Body>
              </View>
            ))}
          </View>

          <View style={styles.stats}>
            <Card tone="soft" style={styles.stat}>
              <Title style={styles.statValue}>{reputation.confirmedMeetups}</Title>
              <Body muted style={styles.statLabel}>Abende da gewesen</Body>
            </Card>
            <Card tone="soft" style={styles.stat}>
              <Title style={styles.statValue}>{reputation.hostedSeasons}</Title>
              <Body muted style={styles.statLabel}>Kreise geführt</Body>
            </Card>
            <Card tone="soft" style={styles.stat}>
              <Title style={styles.statValue}>
                {reputation.reliabilityPercent == null ? "–" : `${reputation.reliabilityPercent}%`}
              </Title>
              <Body muted style={styles.statLabel}>Wirklich erschienen</Body>
            </Card>
          </View>

          <Button
            label="Treffen festlegen"
            variant="secondary"
            onPress={() => {
              const existing = hostedCircleNeedingSchedule(state) ?? hostedCircles(state)[0];
              dispatch({ type: "ENSURE_HOST_CIRCLE" });
              const id = existing?.id ?? `circle-host-${state.currentUser.id}`;
              openCircle(id, "profil");
            }}
          />
          <Button
            label="Checklisten für den Abend"
            variant="ghost"
            onPress={() => router.push("/(tabs)/profil/host-kits" as Href)}
          />

          {empty && (
            <EmptyState
              kicker="Noch still hier"
              title="Dein Kreis beginnt klein"
              body="Unter Entdecken findest du eine Runde, die sich leicht anfühlt. Oder du lädst selbst ein."
            />
          )}

          {reputation.guestCircles.length > 0 && (
            <View style={{ gap: space.sm }}>
              <SectionLabel>Als Teilnehmer:in</SectionLabel>
              {reputation.guestCircles.map((circle, index) => (
                <CircleCard
                  key={circle.id}
                  circle={circle}
                  delay={Math.min(index * 40, 160)}
                  onPress={() => openCircle(circle.id, "profil")}
                  currentUserId={state.currentUser.id}
                />
              ))}
            </View>
          )}

          {reputation.hostedCircles.length > 0 && (
            <View style={{ gap: space.sm }}>
              <SectionLabel>Als Gastgeber:in</SectionLabel>
              {reputation.hostedCircles.map((circle, index) => (
                <CircleCard
                  key={circle.id}
                  circle={circle}
                  delay={Math.min(index * 40, 160)}
                  onPress={() => openCircle(circle.id, "profil")}
                  currentUserId={state.currentUser.id}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {},
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: space.sm },
  gear: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  identity: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  place: { fontSize: 17, lineHeight: 22 },
  bio: { marginTop: 4 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: space.xs, marginTop: space.sm },
  tag: {
    backgroundColor: colors.glass,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 6,
  },
  tagText: { ...type.caption, color: colors.coralDark, fontWeight: "600" },
  marks: { gap: space.xs },
  mark: { borderRadius: 16, paddingHorizontal: space.sm, paddingVertical: space.sm },
  markOn: { backgroundColor: colors.sageLight },
  markOff: {
    backgroundColor: "transparent",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  markTitleOn: { color: colors.sage },
  markTitleOff: { color: colors.muted },
  markHint: { marginTop: 4, fontSize: 13, lineHeight: 17 },
  stats: { flexDirection: "row", gap: space.xs },
  stat: { flex: 1 },
  statValue: { fontWeight: "700" },
  statLabel: { marginTop: 4, fontSize: 13, lineHeight: 17 },
});
