import { StyleSheet, View } from "react-native";

import { guideFor } from "../domain/copy";
import type { FormatType } from "../domain/types";
import { colors, space } from "../theme/tokens";
import { Body, Card, Kicker, Title } from "./ui";

export function FormatGuideCard({ format }: { format: FormatType }) {
  const guide = guideFor(format);
  return (
    <Card tone="soft">
      <Title>
        {guide.icon} {guide.label}
      </Title>
      <Kicker clay style={styles.meta}>
        {guide.duration}
      </Kicker>
      <Row label="Was passiert" text={guide.happens} />
      <Row label="Mitbringen" text={guide.need} />
      <Row label="Anziehen" text={guide.wear} />
      <Row label="Druck" text={guide.pressure} />
    </Card>
  );
}

function Row({ label, text }: { label: string; text: string }) {
  return (
    <View style={styles.row}>
      <Kicker>{label}</Kicker>
      <Body style={styles.body}>{text}</Body>
    </View>
  );
}

const styles = StyleSheet.create({
  meta: { marginTop: 4, marginBottom: 10 },
  row: { marginTop: space.sm },
  body: { marginTop: 3, color: colors.ink },
});
