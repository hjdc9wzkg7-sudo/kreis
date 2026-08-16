import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Atmosphere } from "@/src/components/glass";
import { Body, Button, Display, Kicker, ProgressDots } from "@/src/components/ui";
import { space } from "@/src/theme/tokens";

export default function WelcomeScreen() {
  return (
    <Atmosphere>
      <SafeAreaView style={styles.safe}>
        <ProgressDots step={0} total={6} />
        <View style={styles.hero}>
          <Kicker clay>KREIS · Demo</Kicker>
          <Display>Ein Abend. Ein paar Leute. Kein Feed.</Display>
          <Body muted style={styles.body}>
            4–8 Menschen in deinem Kiez kochen, gehen oder reden — und sehen sich wieder. Du sagst
            zu, dann siehst du wo. Still mitmachen ist okay.
          </Body>
          <Body muted>
            Alles bleibt auf diesem iPhone. Die Kreise sind Beispiele, keine echten Runden.
          </Body>
        </View>
        <Button label="Weiter" onPress={() => router.push("/(onboarding)/age")} />
      </SafeAreaView>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, padding: space.lg, justifyContent: "space-between", paddingBottom: 28 },
  hero: { flex: 1, justifyContent: "center", gap: 12 },
  body: { marginTop: 4 },
});
