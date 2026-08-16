import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS, Platform } from "react-native";

import { colors } from "@/src/theme/tokens";

const tint =
  Platform.OS === "ios"
    ? DynamicColorIOS({ light: colors.coral, dark: "#F0A090" })
    : colors.coral;

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown" tintColor={tint}>
      <NativeTabs.Trigger name="index">
        <Label>Heute</Label>
        <Icon sf={{ default: "sun.max", selected: "sun.max.fill" }} drawable="ic_menu_today" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="entdecken">
        <Label>Entdecken</Label>
        <Icon sf={{ default: "sparkles", selected: "sparkles" }} drawable="ic_menu_compass" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="kreise">
        <Label>Kreise</Label>
        <Icon sf={{ default: "person.3", selected: "person.3.fill" }} drawable="ic_menu_myplaces" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profil">
        <Label>Profil</Label>
        <Icon
          sf={{ default: "person.crop.circle", selected: "person.crop.circle.fill" }}
          drawable="ic_menu_myplaces"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
