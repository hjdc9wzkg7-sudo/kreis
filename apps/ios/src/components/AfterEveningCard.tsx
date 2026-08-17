import { StyleSheet } from "react-native";

import type { Meetup } from "../domain/types";
import { space } from "../theme/tokens";
import { ActionRow, Body, Button, Card, Title } from "./ui";

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
      <ActionRow
        primary={
          <Button
            label="Ja"
            variant={wouldRepeat === true ? "primary" : "secondary"}
            haptic="success"
            onPress={() => onRate(true)}
          />
        }
        secondary={
          <Button label="Nein" variant="ghost" onPress={() => onRate(false)} />
        }
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  lead: { marginTop: space.xs, marginBottom: space.sm },
});
