import { router, type Href } from "expo-router";
import { Alert, StyleSheet, Switch, TextInput, View } from "react-native";

import { FormatGuideCard } from "@/src/components/FormatGuideCard";
import { StackScreen } from "@/src/components/Screen";
import { Body, Button, Card, ChoiceChips, SectionLabel, fieldStyle } from "@/src/components/ui";
import {
  availabilityLabels,
  formatLabels,
  neighborhoods,
  paceHints,
  paceLabels,
} from "@/src/domain/copy";
import { intentionPace } from "@/src/domain/matching";
import type { Availability, FormatType, SocialPace } from "@/src/domain/types";
import { signOut } from "@/src/lib/auth";
import { useApp, useResetDemo } from "@/src/state/store";
import { colors } from "@/src/theme/tokens";

export default function SettingsScreen() {
  const { state, dispatch } = useApp();
  const reset = useResetDemo();
  const { intention } = state.currentUser;
  const pace = intentionPace(state.currentUser);

  function toggleFormat(format: FormatType) {
    const formats = intention.formats.includes(format)
      ? intention.formats.filter((item) => item !== format)
      : [...intention.formats, format];
    dispatch({ type: "UPDATE_INTENTION", intention: { formats } });
  }

  return (
    <StackScreen>
      <Card>
        <Body style={styles.switchTitle}>Geschlossene Demo</Body>
        <Body muted>Kein Konto, keine anderen echten Leute. Daten nur auf diesem iPhone.</Body>
        <Button
          label="Demo & Datenschutz"
          variant="secondary"
          onPress={() => router.push("/(tabs)/profil/demo" as Href)}
          style={styles.afterCopy}
        />
      </Card>

      <Body muted>Hier stellst du ein, welche Einladungen zu dir passen.</Body>

      <SectionLabel>Name</SectionLabel>
      <TextInput
        value={state.currentUser.name}
        onChangeText={(name) => dispatch({ type: "UPDATE_NAME", name })}
        style={fieldStyle}
        accessibilityLabel="Name"
      />

      <SectionLabel>Wie kommst du an?</SectionLabel>
      <ChoiceChips
        options={(Object.keys(paceLabels) as SocialPace[]).map((item) => ({
          key: item,
          label: paceLabels[item],
        }))}
        selected={(item) => pace === item}
        onSelect={(item) => dispatch({ type: "UPDATE_INTENTION", intention: { pace: item } })}
      />
      <Body muted>{paceHints[pace]}</Body>

      <SectionLabel>Wann passt's?</SectionLabel>
      <ChoiceChips
        options={(Object.keys(availabilityLabels) as Availability[]).map((item) => ({
          key: item,
          label: availabilityLabels[item],
        }))}
        selected={(item) => intention.availability === item}
        onSelect={(item) => dispatch({ type: "UPDATE_INTENTION", intention: { availability: item } })}
      />

      <SectionLabel>Womit startest du?</SectionLabel>
      <ChoiceChips
        options={(Object.keys(formatLabels) as FormatType[]).map((format) => ({
          key: format,
          label: formatLabels[format],
        }))}
        selected={(format) => intention.formats.includes(format)}
        onSelect={toggleFormat}
      />
      {intention.formats[0] ? <FormatGuideCard format={intention.formats[0]} /> : null}

      <SectionLabel>Gegend</SectionLabel>
      <ChoiceChips
        options={neighborhoods.map((item) => ({ key: item, label: item }))}
        selected={(item) => intention.neighborhood === item}
        onSelect={(item) => dispatch({ type: "UPDATE_INTENTION", intention: { neighborhood: item } })}
      />

      <SectionLabel>Über dich</SectionLabel>
      <TextInput
        value={intention.bio}
        onChangeText={(bio) => dispatch({ type: "UPDATE_INTENTION", intention: { bio } })}
        style={styles.area}
        multiline
        accessibilityLabel="Über dich"
      />

      <Card>
        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <Body style={styles.switchTitle}>Einladungen an mich anpassen</Body>
            <Body muted>
              Dann siehst du zuerst Kreise, die zu Ort, Zeit und Format passen — mit einem klaren Grund.
            </Body>
          </View>
          <Switch
            value={state.settings.personalizationEnabled}
            onValueChange={(enabled) => dispatch({ type: "SET_PERSONALIZATION", enabled })}
            trackColor={{ true: colors.sage, false: colors.sand }}
          />
        </View>
      </Card>

      <Button
        label="Sicherheit"
        variant="secondary"
        onPress={() => router.push("/(tabs)/profil/sicherheit" as Href)}
      />
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
        label="Abmelden"
        variant="secondary"
        onPress={() =>
          Alert.alert("Abmelden?", "Du kannst dich jederzeit wieder mit deiner E-Mail anmelden.", [
            { text: "Abbrechen", style: "cancel" },
            {
              text: "Abmelden",
              style: "destructive",
              onPress: () => {
                void signOut().then(() => router.replace("/login"));
              },
            },
          ])
        }
      />
      <Button
        label="Demo zurücksetzen"
        variant="danger"
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
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  afterCopy: { marginTop: 12 },
  area: {
    ...fieldStyle,
    minHeight: 90,
    textAlignVertical: "top",
  },
  switchRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  switchCopy: { flex: 1 },
  switchTitle: { fontWeight: "600", marginBottom: 4 },
});
