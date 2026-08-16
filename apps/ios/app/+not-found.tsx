import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Atmosphere } from "@/src/components/glass";
import { Button, EmptyState } from "@/src/components/ui";
import { space } from "@/src/theme/tokens";

export default function NotFoundScreen() {
  return (
    <Atmosphere>
      <View style={styles.wrap}>
        <EmptyState
          kicker="Falsche Abbiegung"
          title="Diese Seite gibt es nicht"
          body="Kein Problem — auf Heute geht es weiter."
          action={<Button label="Zu Heute" onPress={() => router.replace("/(tabs)")} />}
        />
      </View>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", padding: space.lg },
});
