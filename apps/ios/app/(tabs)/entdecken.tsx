import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { CircleCard } from "@/src/components/CircleCard";
import { FormatGuideCard } from "@/src/components/FormatGuideCard";
import { Atmosphere } from "@/src/components/glass";
import { Body, Button, Display, EmptyState } from "@/src/components/ui";
import { useTabScrollPadding } from "@/src/components/useTabScrollPadding";
import { getDailySuggestions } from "@/src/domain/matching";
import { openCircle } from "@/src/navigation";
import { useApp } from "@/src/state/store";
import { space } from "@/src/theme/tokens";

export default function DiscoverScreen() {
  const { state, dispatch } = useApp();
  const suggestions = getDailySuggestions(state);
  const current = suggestions[0];
  const [showGuide, setShowGuide] = useState(false);
  const tabPad = useTabScrollPadding();

  useEffect(() => {
    setShowGuide(false);
  }, [current?.circle.id]);

  function join(id: string) {
    dispatch({ type: "JOIN_CIRCLE", circleId: id });
    openCircle(id, "entdecken");
  }

  return (
    <Atmosphere>
      <View collapsable={false} style={styles.safe}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: tabPad }]}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Display>Entdecken</Display>
            <Body muted>
              {suggestions.length === 0
                ? "Heute keine offene Einladung mehr."
                : suggestions.length === 1
                  ? "Eine offene Einladung."
                  : `${suggestions.length} offene Einladungen — eine nach der anderen.`}
            </Body>
          </View>

          {!current ? (
            <EmptyState
              kicker="Pause verdient"
              title="Für heute genug"
              body="Ruhig ausatmen. Morgen wartet wieder eine Einladung — oder du sagst unter dem Zahnrad, was sich richtig anfühlt."
            />
          ) : (
            <>
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
            </>
          )}
        </ScrollView>
      </View>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: space.lg, gap: 20, paddingTop: 56 },
  intro: { gap: 6 },
});
