import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Atmosphere } from "@/src/components/glass";
import { Body, Card, Kicker, Title } from "@/src/components/ui";
import { formatLabels } from "@/src/domain/copy";
import { useTabScrollPadding } from "@/src/components/useTabScrollPadding";
import { hostKits } from "@/src/domain/data";
import { colors, space, type } from "@/src/theme/tokens";

export default function HostKitsScreen() {
  const tabPad = useTabScrollPadding();
  return (
    <Atmosphere>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabPad }]}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Body muted>
          Das sind Checklisten für Gastgeber:innen: Was passiert am Abend, in welcher Reihenfolge,
          worauf ihr achten solltet. Später kannst du damit auch Geld verdienen — gemessen daran,
          ob Leute wiederkommen.
        </Body>
        {hostKits.map((kit) => (
          <Card key={kit.id}>
            <Kicker clay>
              {formatLabels[kit.format]} · {kit.duration}
              {kit.verified ? " · geprüft" : ""}
            </Kicker>
            <View style={{ marginVertical: 6 }}>
              <Title>{kit.title}</Title>
            </View>
            <Body muted>{kit.summary}</Body>
            <Text style={styles.block}>Ablauf</Text>
            {kit.steps.map((step, index) => (
              <Body key={step} muted>
                {index + 1}. {step}
              </Body>
            ))}
          </Card>
        ))}
      </ScrollView>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.lg, gap: 14 },
  block: { ...type.callout, marginTop: 12, marginBottom: 4, color: colors.ink },
});
