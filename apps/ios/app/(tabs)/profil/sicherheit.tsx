import { StyleSheet } from "react-native";

import { StackScreen } from "@/src/components/Screen";
import { Body, Card } from "@/src/components/ui";
import { safetyLines } from "@/src/domain/copy";

export default function SafetyScreen() {
  return (
    <StackScreen>
      <Body muted>Kurz und klar — mehr Regeln braucht es am Anfang nicht.</Body>
      <Card>
        {safetyLines.map((line) => (
          <Body key={line} style={styles.line}>
            · {line}
          </Body>
        ))}
      </Card>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  line: { marginBottom: 8 },
});
