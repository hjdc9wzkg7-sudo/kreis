import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { Atmosphere } from "@/src/components/glass";
import { Button, Card } from "@/src/components/ui";
import { colors, space } from "@/src/theme/tokens";

export default function NotFoundScreen() {
  return (
    <Atmosphere>
      <Card style={styles.card}>
        <Text style={styles.title}>Diese Seite gibt es nicht.</Text>
        <Text style={styles.body}>Kein Problem — zurück zu Heute, dort geht es weiter.</Text>
        <Button label="Zu Heute" onPress={() => router.replace("/(tabs)")} style={{ marginTop: 16 }} />
      </Card>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  card: { margin: space.lg, marginTop: 120 },
  title: { fontSize: 22, fontWeight: "700", color: colors.ink },
  body: { marginTop: 8, color: colors.muted, lineHeight: 22 },
});
