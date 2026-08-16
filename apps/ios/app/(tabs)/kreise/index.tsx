import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { CircleCard } from "@/src/components/CircleCard";
import { Atmosphere } from "@/src/components/glass";
import { Body, Button, Display, EmptyState } from "@/src/components/ui";
import { useScreenPadding } from "@/src/components/useTabScrollPadding";
import { getJoinedCircles } from "@/src/domain/matching";
import { openCircle } from "@/src/navigation";
import { useApp } from "@/src/state/store";

export default function CirclesScreen() {
  const { state } = useApp();
  const joined = getJoinedCircles(state);
  const screenPad = useScreenPadding();

  return (
    <Atmosphere>
      <View collapsable={false} style={styles.safe}>
        <ScrollView
          contentContainerStyle={[styles.content, screenPad]}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Display>Meine Kreise</Display>
            <Body muted>
              {joined.length === 0
                ? "Noch niemand um den Tisch. Eine Runde reicht."
                : `${joined.length} aktive ${joined.length === 1 ? "Kreis" : "Kreise"}`}
            </Body>
          </View>

          {joined.length === 0 ? (
            <EmptyState
              kicker="Noch Platz"
              title="Dein erster Kreis wartet"
              body="Unter Entdecken liegen ein paar offene Runden. Eine reicht, um anzufangen."
              action={<Button label="Zu Entdecken" onPress={() => router.push("/(tabs)/entdecken")} />}
            />
          ) : (
            joined.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                onPress={() => openCircle(circle.id, "kreise")}
                currentUserId={state.currentUser.id}
              />
            ))
          )}
        </ScrollView>
      </View>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {},
  intro: { gap: 6 },
});
