import { Redirect, useLocalSearchParams, type Href } from "expo-router";

/** Alte Tab-Route — Detail liegt im Root-Stack, damit Zurück den Ursprung trifft. */
export default function LegacyCircleRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`/kreis/${id}` as Href} />;
}
