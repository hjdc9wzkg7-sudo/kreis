import { StyleSheet, Text, View } from "react-native";

import { guideFor } from "../domain/copy";
import type { FormatType } from "../domain/types";
import { colors, type, typeScale } from "../theme/tokens";
import { Card } from "./ui";

export function FormatGuideCard({ format }: { format: FormatType }) {
  const guide = guideFor(format);
  return (
    <Card>
      <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.title}>
        {guide.icon} {guide.label}
      </Text>
      <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.meta}>
        {guide.duration}
      </Text>
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
      <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.label}>
        {label}
      </Text>
      <Text allowFontScaling maxFontSizeMultiplier={typeScale.body} style={styles.body}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...type.subtitle, fontWeight: "700", color: colors.ink },
  meta: { ...type.callout, color: colors.coral, marginTop: 4, marginBottom: 10 },
  row: { marginTop: 10 },
  label: { ...type.kicker, color: colors.muted, marginBottom: 3 },
  body: { ...type.callout, fontWeight: "400", color: colors.ink },
});
