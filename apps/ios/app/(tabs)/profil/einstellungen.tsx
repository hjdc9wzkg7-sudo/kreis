import { router, type Href } from "expo-router";
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { Atmosphere } from "@/src/components/glass";
import { Button, Card, Chip, SectionLabel } from "@/src/components/ui";
import { FormatGuideCard } from "@/src/components/FormatGuideCard";
import {
  availabilityLabels,
  formatLabels,
  neighborhoods,
  paceHints,
  paceLabels,
  safetyLines,
} from "@/src/domain/copy";
import { intentionPace } from "@/src/domain/matching";
import type { Availability, FormatType, SocialPace } from "@/src/domain/types";
import { useTabScrollPadding } from "@/src/components/useTabScrollPadding";
import { useApp, useResetDemo } from "@/src/state/store";
import { colors, radius, space, type } from "@/src/theme/tokens";

export default function SettingsScreen() {
  const { state, dispatch } = useApp();
  const reset = useResetDemo();
  const { intention } = state.currentUser;
  const tabPad = useTabScrollPadding();

  function toggleFormat(format: FormatType) {
    const formats = intention.formats.includes(format)
      ? intention.formats.filter((item) => item !== format)
      : [...intention.formats, format];
    dispatch({ type: "UPDATE_INTENTION", intention: { formats } });
  }

  return (
    <Atmosphere>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabPad }]}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <Text style={styles.switchTitle}>Geschlossene Demo</Text>
          <Text style={styles.meta}>
            Kein Konto, keine anderen echten Leute. Daten nur auf diesem iPhone.
          </Text>
          <Button
            label="Demo & Datenschutz"
            variant="secondary"
            onPress={() => router.push("/(tabs)/profil/demo" as Href)}
            style={{ marginTop: 12 }}
          />
        </Card>

        <Text style={styles.lead}>
          Hier stellst du ein, welche Einladungen zu dir passen.
        </Text>

        <SectionLabel>Name</SectionLabel>
        <TextInput
          value={state.currentUser.name}
          onChangeText={(name) => dispatch({ type: "UPDATE_NAME", name })}
          style={styles.input}
        />

        <SectionLabel>Wie kommst du an?</SectionLabel>
        <View style={styles.wrap}>
          {(Object.keys(paceLabels) as SocialPace[]).map((item) => (
            <Chip
              key={item}
              label={paceLabels[item]}
              selected={intentionPace(state.currentUser) === item}
              onPress={() => dispatch({ type: "UPDATE_INTENTION", intention: { pace: item } })}
            />
          ))}
        </View>
        <Text style={styles.meta}>{paceHints[intentionPace(state.currentUser)]}</Text>

        <SectionLabel>Wann passt's?</SectionLabel>
        <View style={styles.wrap}>
          {(Object.keys(availabilityLabels) as Availability[]).map((item) => (
            <Chip
              key={item}
              label={availabilityLabels[item]}
              selected={intention.availability === item}
              onPress={() => dispatch({ type: "UPDATE_INTENTION", intention: { availability: item } })}
            />
          ))}
        </View>

        <SectionLabel>Womit startest du?</SectionLabel>
        <View style={styles.wrap}>
          {(Object.keys(formatLabels) as FormatType[]).map((format) => (
            <Chip
              key={format}
              label={formatLabels[format]}
              tone="sage"
              selected={intention.formats.includes(format)}
              onPress={() => toggleFormat(format)}
            />
          ))}
        </View>
        {intention.formats[0] && <FormatGuideCard format={intention.formats[0]} />}

        <SectionLabel>Gegend</SectionLabel>
        <View style={styles.wrap}>
          {neighborhoods.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={intention.neighborhood === item}
              onPress={() => dispatch({ type: "UPDATE_INTENTION", intention: { neighborhood: item } })}
            />
          ))}
        </View>

        <SectionLabel>Über dich</SectionLabel>
        <TextInput
          value={intention.bio}
          onChangeText={(bio) => dispatch({ type: "UPDATE_INTENTION", intention: { bio } })}
          style={styles.area}
          multiline
        />

        <Card>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Einladungen an mich anpassen</Text>
              <Text style={styles.meta}>
                Dann siehst du zuerst Kreise, die zu Ort, Zeit und Format passen — mit einem klaren Grund.
              </Text>
            </View>
            <Switch
              value={state.settings.personalizationEnabled}
              onValueChange={(enabled) => dispatch({ type: "SET_PERSONALIZATION", enabled })}
              trackColor={{ true: colors.sage, false: colors.sand }}
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.switchTitle}>So bleiben wir sicher</Text>
          {safetyLines.map((line) => (
            <Text key={line} style={styles.meta}>
              · {line}
            </Text>
          ))}
        </Card>

        <Button
          label="Checklisten für den Abend"
          variant="secondary"
          onPress={() => router.push("/(tabs)/profil/host-kits" as Href)}
        />
        <Button
          label="Personalisierung zurücksetzen"
          variant="ghost"
          onPress={() => dispatch({ type: "RESET_PERSONALIZATION" })}
        />
        <Button
          label="Demo zurücksetzen"
          variant="ghost"
          onPress={() =>
            Alert.alert(
              "Demo zurücksetzen?",
              "Name, Zusagen und Texte auf diesem iPhone gehen verloren. Die Beispiel-Kreise sind wieder da.",
              [
                { text: "Abbrechen", style: "cancel" },
                { text: "Zurücksetzen", style: "destructive", onPress: () => void reset() },
              ],
            )
          }
        />
      </ScrollView>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.lg, gap: 10 },
  lead: { ...type.body, color: colors.muted, marginBottom: 8 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 6 },
  input: {
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.ink,
    fontSize: type.subtitle.fontSize,
    marginBottom: 8,
  },
  area: {
    minHeight: 90,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: radius.md,
    padding: 14,
    color: colors.ink,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  switchRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  switchTitle: { ...type.callout, color: colors.ink, marginBottom: 4 },
  meta: { ...type.caption, color: colors.muted },
});
