import { StyleSheet, View } from "react-native";

import type { Meetup } from "../domain/types";
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
        <View style={{ flex: 1 }}>
          <Button
            label="Ja"
            variant={wouldRepeat === true ? "primary" : "secondary"}
            onPress={() => onRate(true)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            label="Nein"
            variant="secondary"
            onPress={() => onRate(false)}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  lead: { marginTop: 8, marginBottom: 14 },
  row: { flexDirection: "row", gap: 8 },
});
