import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Atmosphere } from "@/src/components/glass";
import { Body, Button, Card, Chip, Title } from "@/src/components/ui";
import { normalizeParam } from "@/src/navigation";
import { useApp } from "@/src/state/store";
import { space } from "@/src/theme/tokens";

const reasons = [
  "Unsicheres Verhalten",
  "Druck oder Ausgrenzung",
  "Unerwünschte Kontaktaufnahme",
  "Falsche Angaben",
  "Anderes",
];

export default function ReportScreen() {
  const params = useLocalSearchParams<{ circleId?: string | string[] }>();
  const circleId = normalizeParam(params.circleId);
  const { dispatch } = useApp();
  const [reason, setReason] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  return (
    <Atmosphere>
      <View style={styles.safe}>
        <Card>
          {done ? (
            <>
              <Title style={styles.title}>Danke. Wir prüfen das intern.</Title>
              <Body muted style={styles.body}>Die Meldung bleibt privat.</Body>
              <Button label="Schließen" onPress={() => router.back()} style={styles.close} />
            </>
          ) : (
            <>
              <Title style={styles.title}>Kreis melden</Title>
              <Body muted style={styles.body}>Wähle den Grund. Es gibt keine öffentliche Anzeige.</Body>
              <View style={styles.wrap}>
                {reasons.map((item) => (
                  <Chip key={item} label={item} selected={reason === item} onPress={() => setReason(item)} />
                ))}
              </View>
              <Button
                label="Senden"
                disabled={!reason || !circleId}
                onPress={() => {
                  if (!reason || !circleId) return;
                  dispatch({ type: "REPORT_CIRCLE", circleId, reason });
                  setDone(true);
                }}
              />
            </>
          )}
        </Card>
      </View>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, padding: space.lg },
  title: { marginBottom: 8 },
  body: { marginBottom: 16 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  close: { marginTop: 16 },
});
