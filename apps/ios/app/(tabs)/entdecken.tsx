import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { CircleCard } from "@/src/components/CircleCard";
import { FormatGuideCard } from "@/src/components/FormatGuideCard";
import { TabScreen } from "@/src/components/Screen";
import { Button, EmptyState, ScreenIntro } from "@/src/components/ui";
import { getDailySuggestions } from "@/src/domain/matching";
import { openCircle } from "@/src/navigation";
import { useApp } from "@/src/state/store";

export default function DiscoverScreen() {
  const { state, dispatch } = useApp();
  const suggestions = getDailySuggestions(state);
  const current = suggestions[0];
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    setShowGuide(false);
  }, [current?.circle.id]);

  function join(id: string) {
    dispatch({ type: "JOIN_CIRCLE", circleId: id });
    openCircle(id, "entdecken");
  }

  return (
    <TabScreen>
      <ScreenIntro
        display="Entdecken"
        body={
          suggestions.length === 0
            ? "Heute keine offene Einladung mehr."
            : suggestions.length === 1
              ? "Eine offene Einladung."
              : `${suggestions.length} offene Einladungen — eine nach der anderen.`
        }
      />

      {!current ? (
        <EmptyState
          kicker="Pause verdient"
          title="Für heute genug"
          body="Ruhig ausatmen. Morgen wartet wieder eine Einladung — oder du sagst unter dem Zahnrad, was sich richtig anfühlt."
        />
      ) : (
        <View style={styles.stack}>
          <CircleCard
            circle={current.circle}
            reasons={current.reasons}
            onPress={() => openCircle(current.circle.id, "entdecken")}
            onJoin={() => join(current.circle.id)}
            onSkip={() => dispatch({ type: "DISMISS_CIRCLE", circleId: current.circle.id })}
          />
          <Button
            label={showGuide ? "Steckbrief schließen" : "Was erwartet mich dort?"}
            variant="ghost"
            onPress={() => setShowGuide((value) => !value)}
          />
          {showGuide && <FormatGuideCard format={current.circle.format} />}
        </View>
      )}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 8 },
});
