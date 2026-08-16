import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { CircleCard } from "@/src/components/CircleCard";
import { Atmosphere } from "@/src/components/glass";
import { PressableScale } from "@/src/components/motion";
import { Avatar, Button, Card, Display, EmptyState, Kicker, SectionLabel } from "@/src/components/ui";
import { formatLabels, resolveFormat } from "@/src/domain/copy";
import { hostedCircleNeedingSchedule, hostedCircles } from "@/src/domain/matching";
import { useScreenPadding } from "@/src/components/useTabScrollPadding";
import { getReputation } from "@/src/domain/trust";
import { openCircle } from "@/src/navigation";
import { useApp } from "@/src/state/store";
import { colors, space, type } from "@/src/theme/tokens";

export default function ProfileScreen() {
  const { state, dispatch } = useApp();
  const reputation = getReputation(state);
  const { intention } = state.currentUser;
  const screenPad = useScreenPadding();

  return (
    <Atmosphere>
      <View collapsable={false} style={styles.safe}>
        <ScrollView
          contentContainerStyle={[styles.content, screenPad]}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.top}>
            <View style={{ flex: 1, gap: 4 }}>
              <Kicker clay>Profil · Demo</Kicker>
              <Display>{state.currentUser.name}</Display>
            </View>
            <PressableScale
              accessibilityLabel="Einstellungen"
              onPress={() => router.push("/(tabs)/profil/einstellungen" as Href)}
              style={styles.gear}
            >
              <Ionicons name="settings-outline" size={22} color={colors.ink} />
            </PressableScale>
          </View>

          <Card>
            <View style={styles.identity}>
              <Avatar initials={state.currentUser.initials} size={64} />
              <View style={{ flex: 1 }}>
                <Text style={styles.place}>{intention.neighborhood}</Text>
                <Text style={styles.bio}>{intention.bio}</Text>
              </View>
            </View>
            <View style={styles.tags}>
              {intention.formats.map((format) => (
                <View key={format} style={styles.tag}>
                  <Text style={styles.tagText}>{formatLabels[resolveFormat(format)]}</Text>
                </View>
              ))}
            </View>
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
                <Text style={[styles.markTitle, mark.earned ? styles.markTitleOn : styles.markTitleOff]}>
                  {mark.earned ? `✓  ${mark.title}` : mark.title}
                </Text>
                <Text style={styles.markHint}>{mark.hint}</Text>
              </View>
            ))}
          </View>

          <View style={styles.stats}>
            <Card style={styles.stat}>
              <Text style={styles.statValue}>{reputation.confirmedMeetups}</Text>
              <Text style={styles.statLabel}>Abende da gewesen</Text>
            </Card>
            <Card style={styles.stat}>
              <Text style={styles.statValue}>{reputation.hostedSeasons}</Text>
              <Text style={styles.statLabel}>Kreise geführt</Text>
            </Card>
            <Card style={styles.stat}>
              <Text style={styles.statValue}>
                {reputation.reliabilityPercent == null ? "–" : `${reputation.reliabilityPercent}%`}
              </Text>
              <Text style={styles.statLabel}>Wirklich erschienen</Text>
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

          {reputation.guestCircles.length === 0 && reputation.hostedCircles.length === 0 && (
            <EmptyState
              kicker="Noch still hier"
              title="Dein Kreis beginnt klein"
              body="Unter Entdecken findest du eine Runde, die sich leicht anfühlt. Oder du lädst selbst ein."
            />
          )}

          {reputation.guestCircles.length > 0 && (
            <View style={{ gap: 12 }}>
              <SectionLabel>Als Teilnehmer:in</SectionLabel>
              {reputation.guestCircles.map((circle) => (
                <CircleCard
                  key={circle.id}
                  circle={circle}
                  onPress={() => openCircle(circle.id, "profil")}
                />
              ))}
            </View>
          )}

          {reputation.hostedCircles.length > 0 && (
            <View style={{ gap: 12 }}>
              <SectionLabel>Als Gastgeber:in</SectionLabel>
              {reputation.hostedCircles.map((circle) => (
                <CircleCard
                  key={circle.id}
                  circle={circle}
                  onPress={() => openCircle(circle.id, "profil")}
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
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  gear: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  identity: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  place: { ...type.subtitle, fontWeight: "600", color: colors.ink },
  bio: { ...type.body, color: colors.muted, marginTop: 4 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  tag: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: { ...type.caption, color: colors.sage, fontWeight: "600" },
  marks: { gap: 8 },
  mark: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12 },
  markOn: { backgroundColor: colors.sageLight },
  markOff: {
    backgroundColor: "transparent",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(36,31,28,0.12)",
  },
  markTitle: { ...type.callout },
  markTitleOn: { color: colors.sage, fontWeight: "700" },
  markTitleOff: { color: colors.muted, fontWeight: "600" },
  markHint: { ...type.caption, color: colors.muted, marginTop: 4 },
  stats: { flexDirection: "row", gap: 8 },
  stat: { flex: 1 },
  statValue: { ...type.title, fontWeight: "700", color: colors.ink },
  statLabel: { ...type.caption, color: colors.muted, marginTop: 4 },
});
