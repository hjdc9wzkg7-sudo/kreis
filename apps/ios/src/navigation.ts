import { router, type Href } from "expo-router";

export type CircleOrigin = "profil" | "kreise" | "heute" | "entdecken";

export function openCircle(id: string, from: CircleOrigin) {
  router.push({ pathname: "/kreis/[id]", params: { id, from } } as Href);
}

export function leaveCircleScreen(from?: string) {
  if (from === "profil") {
    router.replace("/(tabs)/profil" as Href);
    return;
  }
  if (from === "kreise") {
    router.replace("/(tabs)/kreise" as Href);
    return;
  }
  if (from === "entdecken") {
    router.replace("/(tabs)/entdecken" as Href);
    return;
  }
  if (from === "heute") {
    router.replace("/(tabs)" as Href);
    return;
  }
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace("/(tabs)" as Href);
}
