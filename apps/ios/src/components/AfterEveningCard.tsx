import { StyleSheet, View } from "react-native";

import type { Meetup } from "../domain/types";
import { space } from "../theme/tokens";
import { Body, Button, Card, Title } from "./ui";

export function AfterEveningCard({
  meetup,
  circleName,
  wouldRepeat,
  onRate,
}: {
  meetup: Meetup;
  circleName: string;
  wouldRepeat?: boolean;
  onRate: (wouldRepeat: boolean) => void;
}) {
  return (
    <Card>
      <Title>Wie war's bei {circleName}?</Title>
      <Body muted style={styles.lead}>
        {meetup.title} — würdest du das wieder tun?
      </Body>
      <View style={styles.row}>
        <View style={{ flex: 1.45 }}>
          <Button
            label="Ja"
            variant={wouldRepeat === true ? "primary" : "secondary"}
            haptic="success"
            onPress={() => onRate(true)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            label="Nein"
            variant="ghost"
            onPress={() => onRate(false)}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  lead: { marginTop: space.xs, marginBottom: space.sm },
  row: { flexDirection: "row", gap: space.xs, alignItems: "stretch" },
});
