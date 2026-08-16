import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { CircleCard } from "@/src/components/CircleCard";
import { Atmosphere } from "@/src/components/glass";
import { Body, Button, Display, EmptyState } from "@/src/components/ui";
import { useTabScrollPadding } from "@/src/components/useTabScrollPadding";
import { getJoinedCircles } from "@/src/domain/matching";
import { openCircle } from "@/src/navigation";
import { useApp } from "@/src/state/store";
import { space } from "@/src/theme/tokens";

export default function CirclesScreen() {
  const { state } = useApp();
  const joined = getJoinedCircles(state);
  const tabPad = useTabScrollPadding();

  return (
    <Atmosphere>
      <View collapsable={false} style={styles.safe}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: tabPad }]}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Display>Meine Kreise</Display>
            <Body muted>
              {joined.length === 0
                ? "Noch kein Kreis — ein Ritual reicht."
                : `${joined.length} aktive ${joined.length === 1 ? "Kreis" : "Kreise"}`}
            </Body>
          </View>

          {joined.length === 0 ? (
            <EmptyState
              kicker="Noch Platz"
              title="Dein erster Kreis wartet"
              body="Unter Entdecken liegen heute ein paar Einladungen. Eine reicht."
              action={<Button label="Zu Entdecken" onPress={() => router.push("/(tabs)/entdecken")} />}
            />
          ) : (
            joined.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                onPress={() => openCircle(circle.id, "kreise")}
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
  content: { padding: space.lg, gap: 14, paddingTop: 64 },
  intro: { gap: 6 },
});
