import { StyleSheet } from "react-native";

import { StackScreen } from "@/src/components/Screen";
import { Body, Card, SectionLabel, Title } from "@/src/components/ui";
import { demoLines, privacyBody, testFlightChecks, v1Can, v1Not } from "@/src/domain/legal";
import { colors } from "@/src/theme/tokens";

export default function DemoInfoScreen() {
  return (
    <StackScreen>
        <Title>Diese Demo</Title>
        {demoLines.map((line) => (
          <Body key={line} muted style={styles.line}>
            {line}
          </Body>
        ))}

        <SectionLabel>Was du ausprobieren kannst</SectionLabel>
        <Card>
          {v1Can.map((line) => (
            <Body key={line} style={styles.item}>
              · {line}
            </Body>
          ))}
        </Card>

        <SectionLabel>Was noch nicht geht</SectionLabel>
        <Card>
          {v1Not.map((line) => (
            <Body key={line} muted style={styles.item}>
              · {line}
            </Body>
          ))}
        </Card>

        <SectionLabel>Bitte auf dem iPhone prüfen</SectionLabel>
        <Card>
          {testFlightChecks.map((line) => (
            <Body key={line} muted style={styles.item}>
              · {line}
            </Body>
          ))}
        </Card>

        <SectionLabel>Datenschutz</SectionLabel>
        <Card>
          {privacyBody.map((line) => (
            <Body key={line} muted style={styles.item}>
              {line}
            </Body>
          ))}
        </Card>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  line: { marginBottom: 6 },
  item: { marginBottom: 8, color: colors.ink },
});
