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

const originRoutes: Record<CircleOrigin, Href> = {
  profil: "/(tabs)/profil",
  kreise: "/(tabs)/kreise",
  entdecken: "/(tabs)/entdecken",
  heute: "/(tabs)",
};

export function leaveCircleScreen(from?: string) {
  const origin = parseOrigin(from);
  if (origin) {
    router.replace(originRoutes[origin]);
    return;
  }
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace("/(tabs)");
}
