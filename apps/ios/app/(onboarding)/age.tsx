import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Atmosphere } from "@/src/components/glass";
import { Body, Button, ProgressDots, Title } from "@/src/components/ui";
import { useApp } from "@/src/state/store";
import { space } from "@/src/theme/tokens";

export default function AgeScreen() {
  const { dispatch } = useApp();

  return (
    <Atmosphere>
      <SafeAreaView style={styles.safe}>
        <ProgressDots step={1} total={6} />
        <View style={{ gap: 12, flex: 1, justifyContent: "center" }}>
          <Title>Bist du 18 oder älter?</Title>
          <Body muted>
            KREIS startet nur für Erwachsene. Keine offenen Fremd-DMs, kein öffentliches Profil.
          </Body>
        </View>
        <View style={{ gap: 10 }}>
          <Button
            label="Ja, ich bin 18+"
            onPress={() => {
              dispatch({ type: "VERIFY_AGE" });
              router.push("/(onboarding)/intention");
            }}
          />
          <Button label="Zurück" variant="ghost" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, padding: space.lg, justifyContent: "space-between", paddingBottom: 28 },
});
