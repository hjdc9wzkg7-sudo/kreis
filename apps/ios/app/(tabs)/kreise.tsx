import { router } from "expo-router";

import { CircleCard } from "@/src/components/CircleCard";
import { TabScreen } from "@/src/components/Screen";
import { Button, EmptyState, ScreenIntro } from "@/src/components/ui";
import { getJoinedCircles } from "@/src/domain/matching";
import { openCircle } from "@/src/navigation";
import { useApp } from "@/src/state/store";

export default function CirclesScreen() {
  const { state } = useApp();
  const joined = getJoinedCircles(state);

  return (
    <TabScreen>
      <ScreenIntro
        display="Meine Kreise"
        body={
          joined.length === 0
            ? "Noch niemand um den Tisch. Eine Runde reicht."
            : `${joined.length} aktive ${joined.length === 1 ? "Kreis" : "Kreise"}`
        }
      />

      {joined.length === 0 ? (
        <EmptyState
          kicker="Noch Platz"
          title="Dein erster Kreis wartet"
          body="Unter Entdecken liegen ein paar offene Runden. Eine reicht, um anzufangen."
          action={<Button label="Zu Entdecken" onPress={() => router.push("/(tabs)/entdecken")} />}
        />
      ) : (
        joined.map((circle, index) => (
          <CircleCard
            key={circle.id}
            circle={circle}
            onPress={() => openCircle(circle.id, "kreise")}
            currentUserId={state.currentUser.id}
            delay={Math.min(index * 40, 160)}
          />
        ))
      )}
    </TabScreen>
  );
}
