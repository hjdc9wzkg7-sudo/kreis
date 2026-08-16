import { router, type Href } from "expo-router";

export type CircleOrigin = "profil" | "kreise" | "heute" | "entdecken";

export function openCircle(id: string, from: CircleOrigin) {
  router.push({ pathname: "/kreis/[id]", params: { id, from } } as Href);
}

export function leaveCircleScreen(from?: string) {
  if (router.canGoBack()) {
    router.back();
    return;
  }
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
  router.replace("/(tabs)" as Href);
}
