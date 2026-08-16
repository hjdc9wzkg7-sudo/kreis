import { CURRENT_USER_ID } from "./copy";
import type {
  AppState,
  Circle,
  HostKit,
  Meetup,
  Moment,
  User,
} from "./types";

export const currentUser: User = {
  id: CURRENT_USER_ID,
  name: "Katharina",
  initials: "KP",
  intention: {
    pace: "locker",
    availability: "wochenende",
    language: "Deutsch",
    neighborhood: "Prenzlauer Berg",
    formats: ["kochen", "stadtrundgang"],
    bio: "Neu in Berlin, suche eine kleine Gruppe zum gemeinsamen Kochen und Entdecken.",
  },
};

export const users: User[] = [
  currentUser,
  {
    id: "user-1",
    name: "Lea M.",
    initials: "LM",
    intention: {
      pace: "still",
      availability: "wochenende",
      language: "Deutsch",
      neighborhood: "Prenzlauer Berg",
      formats: ["kochen"],
      bio: "Mag gemeinsames Kochen und gute Gespräche.",
    },
  },
  {
    id: "user-2",
    name: "Jonas K.",
    initials: "JK",
    intention: {
      pace: "schwung",
      availability: "flexibel",
      language: "Deutsch, Englisch",
      neighborhood: "Mitte",
      formats: ["stadtrundgang", "bewegung"],
      bio: "Fotografie-Fan, gerne draußen unterwegs.",
    },
  },
  {
    id: "user-3",
    name: "Sara T.",
    initials: "ST",
    intention: {
      pace: "locker",
      availability: "wochentags",
      language: "Deutsch",
      neighborhood: "Friedrichshain",
      formats: ["kochen", "bewegung"],
      bio: "Studienstart, suche Routinen und echte Kontakte.",
    },
  },
  {
    id: "user-4",
    name: "Marco P.",
    initials: "MP",
    intention: {
      pace: "schwung",
      availability: "wochenende",
      language: "Deutsch",
      neighborhood: "Prenzlauer Berg",
      formats: ["kochen"],
      bio: "Kocht gerne italienisch, offen für neue Leute.",
    },
  },
  {
    id: "user-5",
    name: "Nina W.",
    initials: "NW",
    intention: {
      pace: "still",
      availability: "wochenende",
      language: "Deutsch",
      neighborhood: "Prenzlauer Berg",
      formats: ["stadtrundgang"],
      bio: "Entdecke Berlin mit der Kamera.",
    },
  },
];

export const circles: Circle[] = [
  {
    id: "circle-1",
    name: "Sonntagsküche",
    format: "kochen",
    description:
      "Jeden Sonntag kochen wir gemeinsam ein Gericht aus einer anderen Küche — ohne Perfektionsdruck, mit gutem Gespräch.",
    neighborhood: "Prenzlauer Berg",
    memberIds: ["user-1", "user-4", "user-3"],
    maxMembers: 6,
    hostName: "Lea M.",
    hostId: "user-1",
    nextMeetupId: "meetup-1",
    season: {
      id: "season-1",
      circleId: "circle-1",
      name: "Winterküche",
      format: "kochen",
      startDate: "2026-08-04",
      endDate: "2026-08-25",
      ritual: "Jeden Sonntag ein neues Rezept ausprobieren",
      weekNumber: 2,
      totalWeeks: 3,
    },
  },
  {
    id: "circle-2",
    name: "Kiez-Linse",
    format: "stadtrundgang",
    description:
      "Ein langsamer Rundgang durch den Kiez. Handy reicht. Danach teilt ihr im Kreis ein, zwei Lieblingsmomente.",
    neighborhood: "Prenzlauer Berg",
    memberIds: ["user-2", "user-5"],
    maxMembers: 8,
    hostName: "Jonas K.",
    hostId: "user-2",
    nextMeetupId: "meetup-2",
    season: {
      id: "season-2",
      circleId: "circle-2",
      name: "Sommerlicht",
      format: "stadtrundgang",
      startDate: "2026-08-11",
      endDate: "2026-09-01",
      ritual: "Wöchentlicher Fotowalk mit Abschluss-Ausstellung",
      weekNumber: 1,
      totalWeeks: 3,
    },
  },
  {
    id: "circle-3",
    name: "Morgenrunde",
    format: "bewegung",
    description:
      "Leichte Bewegung am Samstagmorgen — Joggen, Spazieren oder Yoga im Park. Kein Leistungsdruck, nur frische Luft und Gesellschaft.",
    neighborhood: "Friedrichshain",
    memberIds: ["user-3"],
    maxMembers: 6,
    hostName: "Sara T.",
    hostId: "user-3",
    nextMeetupId: "meetup-3",
    season: {
      id: "season-3",
      circleId: "circle-3",
      name: "Frühaufsteher",
      format: "bewegung",
      startDate: "2026-08-18",
      endDate: "2026-09-08",
      ritual: "Samstags 8:30 Uhr im Volkspark",
      weekNumber: 1,
      totalWeeks: 3,
    },
  },
];

export const meetups: Meetup[] = [
  {
    id: "meetup-1",
    circleId: "circle-1",
    title: "Griechische Sonntagsküche",
    date: "2026-08-17",
    time: "17:00",
    location: "Gemeinschaftsküche, Kastanienallee 12, Hinterhaus",
    locationHint: "Genauer Treffpunkt wird erst nach deiner Zusage sichtbar.",
    minDurationMinutes: 90,
    attendance: {},
    rsvps: {
      "user-1": "yes",
      "user-4": "yes",
      "user-3": "maybe",
    },
  },
  {
    id: "meetup-2",
    circleId: "circle-2",
    title: "Hinterhöfe & Graffiti",
    date: "2026-08-14",
    time: "10:00",
    location: "Mauerpark Nord, Eingang Gleimstraße",
    locationHint: "Genauer Treffpunkt wird erst nach deiner Zusage sichtbar.",
    minDurationMinutes: 90,
    attendance: {
      "user-2": "here",
    },
    rsvps: {
      "user-2": "yes",
      "user-5": "yes",
    },
  },
  {
    id: "meetup-3",
    circleId: "circle-3",
    title: "Erste Morgenrunde",
    date: "2026-08-23",
    time: "08:30",
    location: "Volkspark Friedrichshain, Haupteingang",
    locationHint: "Genauer Treffpunkt wird erst nach deiner Zusage sichtbar.",
    minDurationMinutes: 45,
    attendance: {},
    rsvps: {
      "user-3": "yes",
    },
  },
];

export const moments: Moment[] = [
  {
    id: "moment-1",
    circleId: "circle-1",
    authorId: "user-1",
    type: "text",
    content: "Freue mich auf Sonntag! Hab mir ein Moussaka-Rezept rausgesucht.",
    reactions: { "user-4": "👍" },
    createdAt: "2026-08-14T18:30:00",
  },
  {
    id: "moment-2",
    circleId: "circle-1",
    authorId: "user-4",
    type: "photo",
    content: "photo",
    caption: "Letzte Woche: unsere erste gemeinsame Pasta-Nacht",
    reactions: { "user-1": "❤️", "user-3": "👏" },
    createdAt: "2026-08-10T21:15:00",
  },
];

export const hostKits: HostKit[] = [
  {
    id: "kit-1",
    title: "Erste gemeinsame Küche",
    format: "kochen",
    duration: "2,5 Stunden",
    groupSize: "4–6",
    summary: "Ein Einstiegsabend ohne Perfektionsdruck: ein Topf, zwei Gespräche, ein gemeinsamer Tisch.",
    verified: true,
    steps: [
      "20 Min Ankommen und Namensrunde am Tisch",
      "Rollen verteilen: Schneiden, Würzen, Aufräumen",
      "Gemeinsam ein Gericht aus einer Küche, die niemand perfekt kann",
      "Essen ohne Handy in der Mitte",
      "Kurzer Rückblick: Was wollen wir nächste Woche anders?",
    ],
    safetyNotes: [
      "Allergien vorher im Kreis sammeln",
      "Keine Alkoholpflicht",
      "Adresse nur an zugesagte Mitglieder",
    ],
  },
  {
    id: "kit-2",
    title: "Kiez-Details in 90 Minuten",
    format: "stadtrundgang",
    duration: "90 Minuten",
    groupSize: "4–8",
    summary: "Ein langsamer Walk mit einer klaren Frage: Welche Details übersieht man sonst?",
    verified: true,
    steps: [
      "Treffpunkt mit 5-Minuten-Puffer",
      "Ein Thema für den Walk, z. B. Türen, Licht, Schatten",
      "Stille Phasen sind erlaubt",
      "Drei Lieblingsfotos nur im Kreis teilen",
      "Abschluss: ein Satz, was jemand anderes gesehen hat",
    ],
    safetyNotes: [
      "Keine Fotos von unbeteiligten Personen im Gesicht",
      "Route vorab teilen, aber nicht öffentlich",
    ],
  },
  {
    id: "kit-3",
    title: "Sanfte Morgenrunde",
    format: "bewegung",
    duration: "45–60 Minuten",
    groupSize: "3–6",
    summary: "Leichte Bewegung ohne Leistungsdruck. Tempo bestimmt die langsamste Person.",
    verified: true,
    steps: [
      "Ankommen ohne Smalltalk-Zwang",
      "Gemeinsam Tempo und Strecke festlegen",
      "Ein Check-in nach 20 Minuten",
      "Abschlussrunde: Energie 1–5, nächster Termin",
    ],
    safetyNotes: [
      "Kein Vergleich von Tempo oder Distanz",
      "Abbruch ohne Erklärung ist immer okay",
    ],
  },
  {
    id: "kit-4",
    title: "Saisonabschluss",
    format: "kochen",
    duration: "2 Stunden",
    groupSize: "bestehende Gruppe",
    summary: "Ein Ritual für das Ende einer 2–4-Wochen-Saison: erinnern, würdigen, entscheiden.",
    verified: true,
    steps: [
      "Jeder bringt eine Erinnerung mit",
      "Was hat sich gut angefühlt?",
      "Wer möchte eine nächste Saison?",
      "Optional: eine passende Person einladen",
    ],
    safetyNotes: [
      "Kein Druck, weiterzumachen",
      "Absagen bleiben privat",
    ],
  },
];

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function createInitialState(): AppState {
  return {
    currentUser,
    circles,
    meetups,
    moments,
    joinedCircleIds: [],
    ageVerified: false,
    onboardingComplete: false,
    suggestionDate: todayKey(),
    dismissedCircleIds: [],
    reports: [],
    ratings: [],
    settings: {
      personalizationEnabled: true,
      digest: "termine",
    },
    flash: null,
    sawHomeHint: true,
  };
}

export function getUserById(id: string, current?: User): User {
  if (current && current.id === id) return current;
  return (
    users.find((user) => user.id === id) ?? {
      id,
      name: "Mitglied",
      initials: "?",
      intention: {
        pace: "locker",
        availability: "flexibel",
        language: "Deutsch",
        neighborhood: "",
        formats: [],
        bio: "",
      },
    }
  );
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "KP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
