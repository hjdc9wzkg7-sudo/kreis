import { ScrollView, StyleSheet, Text } from "react-native";

import { Atmosphere } from "@/src/components/glass";
import { Body, Card } from "@/src/components/ui";
import { useTabScrollPadding } from "@/src/components/useTabScrollPadding";
import { safetyLines } from "@/src/domain/copy";
import { colors, space, type } from "@/src/theme/tokens";

export default function SafetyScreen() {
  const tabPad = useTabScrollPadding();
  return (
    <Atmosphere>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabPad }]}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Body muted>Kurz und klar — mehr Regeln braucht es am Anfang nicht.</Body>
        <Card>
          {safetyLines.map((line) => (
            <Text key={line} style={styles.body}>
              · {line}
            </Text>
          ))}
        </Card>
      </ScrollView>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.lg, gap: 12 },
  body: { ...type.body, color: colors.ink, marginBottom: 8 },
});
