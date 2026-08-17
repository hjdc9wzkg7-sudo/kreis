import { StyleSheet, View } from "react-native";

import { StackScreen } from "@/src/components/Screen";
import { Body, Card, Kicker, SectionLabel, Title } from "@/src/components/ui";
import { formatLabels } from "@/src/domain/copy";
import { hostKits } from "@/src/domain/data";
import { space } from "@/src/theme/tokens";

export default function HostKitsScreen() {
  return (
    <StackScreen>
      <Body muted>
        Das sind Checklisten für Gastgeber:innen: Was passiert am Abend, in welcher Reihenfolge,
        worauf ihr achten solltet. Später kannst du damit auch Geld verdienen — gemessen daran,
        ob Leute wiederkommen.
      </Body>
      {hostKits.map((kit) => (
        <Card key={kit.id}>
          <Kicker clay>
            {formatLabels[kit.format]} · {kit.duration} · {kit.groupSize}
            {kit.verified ? " · geprüft" : ""}
          </Kicker>
          <View style={styles.titleWrap}>
            <Title>{kit.title}</Title>
          </View>
          <Body muted>{kit.summary}</Body>
          <SectionLabel>Ablauf</SectionLabel>
          {kit.steps.map((step, index) => (
            <Body key={step} muted>
              {index + 1}. {step}
            </Body>
          ))}
          <SectionLabel>Sicherheit</SectionLabel>
          {kit.safetyNotes.map((note) => (
            <Body key={note} muted>
              · {note}
            </Body>
          ))}
        </Card>
      ))}
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  titleWrap: { marginVertical: space.xs },
});
