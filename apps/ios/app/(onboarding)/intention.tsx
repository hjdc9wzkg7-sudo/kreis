import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FormatGuideCard } from "@/src/components/FormatGuideCard";
import { Atmosphere } from "@/src/components/glass";
import { Body, Button, Chip, ProgressDots, Title } from "@/src/components/ui";
import {
  availabilityLabels,
  formatLabels,
  neighborhoods,
  paceHints,
  paceLabels,
} from "@/src/domain/copy";
import { intentionPace } from "@/src/domain/matching";
import type { Availability, FormatType, SocialPace, UserIntention } from "@/src/domain/types";
import { useApp } from "@/src/state/store";
import { colors, radius, space, type } from "@/src/theme/tokens";

const steps = ["name", "pace", "whenwhere", "formats"] as const;

export default function IntentionScreen() {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(state.currentUser.name);
  const [openFormat, setOpenFormat] = useState<FormatType | null>(null);
  const [intention, setIntention] = useState<UserIntention>({
    ...state.currentUser.intention,
    pace: intentionPace(state.currentUser),
  });
  const current = steps[step];
  const pace = intention.pace;

  function toggleFormat(format: FormatType) {
    setIntention((value) => ({
      ...value,
      formats: value.formats.includes(format)
        ? value.formats.filter((item) => item !== format)
        : [...value.formats, format],
    }));
    setOpenFormat(format);
  }

  const canContinue = useMemo(() => {
    if (current === "name") return name.trim().length > 1;
    if (current === "pace") return Boolean(pace);
    if (current === "whenwhere") return Boolean(intention.availability) && Boolean(intention.neighborhood);
    return intention.formats.length > 0;
  }, [current, name, pace, intention]);

  function next() {
    if (step < steps.length - 1) {
      setStep((value) => value + 1);
      return;
    }
    dispatch({ type: "COMPLETE_ONBOARDING", name: name.trim(), intention });
    router.replace("/(tabs)");
  }

  return (
    <Atmosphere>
      <SafeAreaView style={styles.safe}>
        <ProgressDots step={step + 2} total={6} />
        <ScrollView contentContainerStyle={styles.main} showsVerticalScrollIndicator={false}>
          {current === "name" && (
            <>
              <Title>Wie dürfen wir dich nennen?</Title>
              <Body muted>Nur der Vorname reicht.</Body>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Dein Name"
                placeholderTextColor={colors.muted}
                style={styles.input}
                autoFocus
              />
            </>
          )}

          {current === "pace" && (
            <>
              <Title>Wie kommst du in einer neuen Runde an?</Title>
              <Body muted>Damit wir dir keine zu laute oder zu stille Gruppe vorschlagen.</Body>
              <View style={styles.wrap}>
                {(Object.keys(paceLabels) as SocialPace[]).map((item) => (
                  <Chip
                    key={item}
                    label={paceLabels[item]}
                    selected={pace === item}
                    onPress={() => setIntention((value) => ({ ...value, pace: item }))}
                  />
                ))}
              </View>
              {pace && <Body>{paceHints[pace]}</Body>}
            </>
          )}

          {current === "whenwhere" && (
            <>
              <Title>Wann und wo passt's?</Title>
              <Body muted>Unter der Woche, Wochenende — und in welchem Kiez.</Body>
              <View style={styles.wrap}>
                {(Object.keys(availabilityLabels) as Availability[]).map((item) => (
                  <Chip
                    key={item}
                    label={availabilityLabels[item]}
                    selected={intention.availability === item}
                    onPress={() => setIntention((value) => ({ ...value, availability: item }))}
                  />
                ))}
              </View>
              <View style={styles.wrap}>
                {neighborhoods.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    selected={intention.neighborhood === item}
                    onPress={() => setIntention((value) => ({ ...value, neighborhood: item }))}
                  />
                ))}
              </View>
            </>
          )}

          {current === "formats" && (
            <>
              <Title>Womit willst du starten?</Title>
              <Body muted>Tippe ein Format an — du siehst sofort, was dich erwartet.</Body>
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
              {openFormat && <FormatGuideCard format={openFormat} />}
            </>
          )}


        </ScrollView>

        <View style={{ gap: 8 }}>
          <Button
            label={step === steps.length - 1 ? "Meinen Kreis finden" : "Weiter"}
            disabled={!canContinue}
            onPress={next}
          />
          {step > 0 && <Button label="Zurück" variant="ghost" onPress={() => setStep((value) => value - 1)} />}
        </View>
      </SafeAreaView>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, padding: space.lg, justifyContent: "space-between", paddingBottom: 28 },
  main: { paddingVertical: 20, gap: 14 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 },
  input: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: type.subtitle.fontSize,
    color: colors.ink,
  },
});
