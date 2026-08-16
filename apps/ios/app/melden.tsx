import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Atmosphere } from "@/src/components/glass";
import { Button, Card, Chip } from "@/src/components/ui";
import { useApp } from "@/src/state/store";
import { colors, space } from "@/src/theme/tokens";

const reasons = [
  "Unsicheres Verhalten",
  "Druck oder Ausgrenzung",
  "Unerwünschte Kontaktaufnahme",
  "Falsche Angaben",
  "Anderes",
];

export default function ReportScreen() {
  const { circleId } = useLocalSearchParams<{ circleId: string }>();
  const { dispatch } = useApp();
  const [reason, setReason] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  return (
    <Atmosphere>
      <View style={styles.safe}>
        <Card>
          {done ? (
            <>
              <Text style={styles.title}>Danke. Wir prüfen das intern.</Text>
              <Text style={styles.body}>Die Meldung bleibt privat.</Text>
              <Button label="Schließen" onPress={() => router.back()} style={{ marginTop: 16 }} />
            </>
          ) : (
            <>
              <Text style={styles.title}>Kreis melden</Text>
              <Text style={styles.body}>Wähle den Grund. Es gibt keine öffentliche Anzeige.</Text>
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
  title: { fontSize: 22, fontWeight: "600", color: colors.ink, marginBottom: 8 },
  body: { color: colors.muted, lineHeight: 21, marginBottom: 16 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
});
