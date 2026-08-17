import { ReactNode } from "react";
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { space } from "../theme/tokens";
import { Atmosphere } from "./glass";
import { useScreenPadding, useTabScrollPadding } from "./useTabScrollPadding";

export function TabScreen({ children }: { children: ReactNode }) {
  const padding = useScreenPadding();
  return (
    <Atmosphere>
      <View collapsable={false} style={styles.fill}>
        <ScrollView
          contentContainerStyle={padding}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    </Atmosphere>
  );
}

export function StackScreen({
  children,
  gap = space.md,
  contentStyle,
}: {
  children: ReactNode;
  gap?: number;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const tabPad = useTabScrollPadding();
  return (
    <Atmosphere>
      <ScrollView
        contentContainerStyle={[
          {
            paddingHorizontal: space.lg,
            paddingTop: space.lg,
            paddingBottom: tabPad,
            gap,
          },
          contentStyle,
        ]}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
