import type { Availability, FormatType, SocialPace } from "./types";

export interface FormatGuide {
  id: FormatType;
  label: string;
  icon: string;
  duration: string;
  happens: string;
  need: string;
  wear: string;
  pressure: string;
}

const legacyFormats: Record<string, FormatType> = {
  fotowalk: "stadtrundgang",
  "foto-walk": "stadtrundgang",
};

export function resolveFormat(value: string | undefined): FormatType {
  if (!value) return "kochen";
  if (value in formatGuides) return value as FormatType;
  return legacyFormats[value] ?? "kochen";
}

export function guideFor(value: string | undefined): FormatGuide {
  return formatGuides[resolveFormat(value)];
}

const formatGuides: Record<FormatType, FormatGuide> = {
  kochen: {
    id: "kochen",
    label: "Gemeinsam kochen",
    icon: "🍳",
    duration: "etwa 2–3 Stunden",
    happens:
      "Ihr kocht in einer Küche ein einfaches Gericht, esst zusammen und räumt gemeinsam auf. Es geht ums Beisammensein, nicht ums Restaurant.",
    need: "Nichts mitbringen. Allergien sagst du vorher Bescheid.",
    wear: "Normale Kleidung, die etwas Soße verträgt. Kein Dresscode.",
    pressure: "Du kannst schneiden, rühren oder nur mitessen. Niemand bewertet dein Kochen.",
  },
  stadtrundgang: {
    id: "stadtrundgang",
    label: "Stadtrundgang",
    icon: "📷",
    duration: "etwa 90 Minuten",
    happens:
      "Ihr geht langsam durch den Kiez und achtet auf Details — Türen, Licht, Schatten. Wer mag, fotografiert mit dem Handy. Am Ende teilt ihr im Kreis 1–3 Lieblingsmomente.",
    need: "Kein Profi-Equipment. Handy reicht. Du kannst auch nur gucken.",
    wear: "Bequeme Schuhe, der Witterung angemessen. Kein Sport-Outfit nötig.",
    pressure: "Still mitlaufen ist völlig okay. Es gibt kein Tempo und keine Likes.",
  },
  bewegung: {
    id: "bewegung",
    label: "Leichte Bewegung",
    icon: "🚶",
    duration: "45–60 Minuten",
    happens:
      "Spazieren, lockeres Joggen oder einfaches Mobilisieren im Park. Die langsamste Person bestimmt das Tempo.",
    need: "Keine Mitgliedschaft, kein Wearable.",
    wear: "Was du auch zum Spazieren anziehen würdest.",
    pressure: "Abbruch ohne Erklärung ist immer okay. Kein Vergleich von Distanz.",
  },
  cafe: {
    id: "cafe",
    label: "Café & Gespräch",
    icon: "☕",
    duration: "etwa 75 Minuten",
    happens:
      "Ihr trefft euch in einem Café, bestellt selbst und redet in einer kleinen Runde. Es gibt eine lockere Einstiegsfrage, danach ergibt sich der Rest.",
    need: "Getränk zahlst du selbst. Kein Networking-Pitch.",
    wear: "Alltagskleidung.",
    pressure: "Zuhören zählt. Du musst nicht unterhalten.",
  },
  sprache: {
    id: "sprache",
    label: "Sprache üben",
    icon: "💬",
    duration: "etwa 60 Minuten",
    happens:
      "Kurze Gespräche in der Sprache, die ihr üben wollt — oft Deutsch oder Englisch. Einfache Themen, viel Wiederholung.",
    need: "Kein Kursniveau. Mut zum Fehler reicht.",
    wear: "Alltagskleidung.",
    pressure: "Muttersprache zwischendurch ist erlaubt, wenn jemand hängt.",
  },
  kreativ: {
    id: "kreativ",
    label: "Kreativ werden",
    icon: "🎨",
    duration: "etwa 90 Minuten",
    happens:
      "Zeichnen, Collage oder ein kleines Ding bauen. Das Material bringt die Gastgeberin mit oder ihr teilt euch die Kosten.",
    need: "Kein Talent-Nachweis. Das Ergebnis bleibt privat im Kreis.",
    wear: "Kleidung, die Farbe abkann, oder eine Schürze vor Ort.",
    pressure: "Zuschauen und helfen zählt genauso wie selbst machen.",
  },
};

function mapGuides<K extends "label" | "icon">(key: K): Record<FormatType, FormatGuide[K]> {
  return Object.fromEntries(
    (Object.keys(formatGuides) as FormatType[]).map((id) => [id, formatGuides[id][key]]),
  ) as Record<FormatType, FormatGuide[K]>;
}

export const formatLabels = mapGuides("label");
export const formatIcons = mapGuides("icon");

export function formatLine(format: string | undefined, neighborhood: string): string {
  const id = resolveFormat(format);
  return `${formatIcons[id]} ${formatLabels[id]} · ${neighborhood}`;
}

export const paceLabels: Record<SocialPace, string> = {
  still: "Eher still",
  locker: "Locker dabei",
  schwung: "Bringe gerne Schwung",
};

export const paceHints: Record<SocialPace, string> = {
  still: "Ich höre erstmal zu und komme langsam ins Gespräch.",
  locker: "Ich mache mit, ohne die Runde zu übernehmen.",
  schwung: "Ich bringe gerne Ideen und Stimmung mit.",
};

export const availabilityLabels: Record<Availability, string> = {
  wochentags: "Unter der Woche",
  wochenende: "Am Wochenende",
  flexibel: "Beides geht",
};

export const neighborhoods = [
  "Prenzlauer Berg",
  "Mitte",
  "Friedrichshain",
  "Kreuzberg",
  "Neukölln",
  "Charlottenburg",
] as const;

export const MAX_DAILY_SUGGESTIONS = 3;
export const LOCATION_HINT = "Genauer Treffpunkt wird erst nach deiner Zusage sichtbar.";
export const CURRENT_USER_ID = "user-me";

export const safetyLines = [
  "Nur für Erwachsene (18+).",
  "Den genauen Treffpunkt siehst du erst, wenn du zusagst.",
  "Was im Kreis passiert, bleibt im Kreis.",
];
