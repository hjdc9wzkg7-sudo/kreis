import { router, type Href } from "expo-router";

export type CircleOrigin = "profil" | "kreise" | "heute" | "entdecken";

const origins: CircleOrigin[] = ["profil", "kreise", "heute", "entdecken"];

export function normalizeParam(value?: string | string[]): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw || undefined;
}

export function parseOrigin(value?: string | string[]): CircleOrigin | undefined {
  const raw = normalizeParam(value);
  return origins.find((item) => item === raw);
}

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
