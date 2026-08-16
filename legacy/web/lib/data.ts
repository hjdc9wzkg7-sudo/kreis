import type {
  AppState,
  Circle,
  Meetup,
  Moment,
  User,
} from "./types";

export const currentUser: User = {
  id: "user-me",
  name: "Katharina",
  initials: "KP",
  intention: {
    energy: "ausgeglichen",
    availability: "wochenende",
    language: "Deutsch",
    neighborhood: "Prenzlauer Berg",
    formats: ["kochen", "fotowalk"],
    bio: "Neu in Berlin, suche kleine Gruppe zum gemeinsamen Kochen und Entdecken.",
  },
};

export const users: User[] = [
  currentUser,
  {
    id: "user-1",
    name: "Lea M.",
    initials: "LM",
    intention: {
      energy: "ruhig",
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
      energy: "aktiv",
      availability: "flexibel",
      language: "Deutsch, Englisch",
      neighborhood: "Mitte",
      formats: ["fotowalk", "bewegung"],
      bio: "Fotografie-Fan, gerne draußen unterwegs.",
    },
  },
  {
    id: "user-3",
    name: "Sara T.",
    initials: "ST",
    intention: {
      energy: "ausgeglichen",
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
      energy: "aktiv",
      availability: "wochenende",
      language: "Deutsch, Italienisch",
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
      energy: "ruhig",
      availability: "wochenende",
      language: "Deutsch",
      neighborhood: "Prenzlauer Berg",
      formats: ["fotowalk"],
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
    memberIds: ["user-me", "user-1", "user-4", "user-3"],
    maxMembers: 6,
    hostName: "Lea M.",
    whyMatch: [
      "Gleiche Gegend: Prenzlauer Berg",
      "Dein Format: Kochen",
      "Ähnliche Energie: ausgeglichen",
      "Verfügbarkeit passt: Wochenende",
    ],
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
    nextMeetupId: "meetup-1",
  },
  {
    id: "circle-2",
    name: "Kiez-Linse",
    format: "fotowalk",
    description:
      "Samstags 90 Minuten durch den Kiez — wir fotografieren Details, die man sonst übersieht, und teilen danach unsere Lieblingsmomente.",
    neighborhood: "Prenzlauer Berg",
    memberIds: ["user-2", "user-5"],
    maxMembers: 8,
    hostName: "Jonas K.",
    whyMatch: [
      "Gleiche Gegend: Prenzlauer Berg",
      "Dein Format: Fotowalk",
      "Aktive Gruppe mit ähnlicher Energie",
    ],
    season: {
      id: "season-2",
      circleId: "circle-2",
      name: "Sommerlicht",
      format: "fotowalk",
      startDate: "2026-08-11",
      endDate: "2026-09-01",
      ritual: "Wöchentlicher Fotowalk mit Abschluss-Ausstellung",
      weekNumber: 1,
      totalWeeks: 3,
    },
    nextMeetupId: "meetup-2",
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
    whyMatch: [
      "Format: Bewegung",
      "Kleine, neue Gruppe — du wärst früh dabei",
      "Ruhige Energie, gut für den Einstieg",
    ],
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
    nextMeetupId: "meetup-3",
  },
];

export const meetups: Meetup[] = [
  {
    id: "meetup-1",
    circleId: "circle-1",
    title: "Griechische Sonntagsküche",
    date: "2026-08-17",
    time: "17:00",
    location: "Gemeinschaftsküche, Kastanienallee",
    locationHint: "Genauer Ort nach RSVP sichtbar",
    rsvps: {
      "user-me": "yes",
      "user-1": "yes",
      "user-4": "yes",
      "user-3": "maybe",
    },
  },
  {
    id: "meetup-2",
    circleId: "circle-2",
    title: "Fotowalk: Hinterhöfe & Graffiti",
    date: "2026-08-16",
    time: "10:00",
    location: "Treffpunkt: Mauerpark Nord",
    locationHint: "Genauer Ort nach RSVP sichtbar",
    rsvps: {
      "user-2": "yes",
      "user-5": "pending",
    },
  },
  {
    id: "meetup-3",
    circleId: "circle-3",
    title: "Erste Morgenrunde",
    date: "2026-08-23",
    time: "08:30",
    location: "Volkspark Friedrichshain, Haupteingang",
    locationHint: "Genauer Ort nach RSVP sichtbar",
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
    content: "Freue mich auf Sonntag! Hab mir ein Moussaka-Rezept rausgesucht 🍆",
    reactions: { "user-me": "❤️", "user-4": "👍" },
    createdAt: "2026-08-14T18:30:00",
  },
  {
    id: "moment-2",
    circleId: "circle-1",
    authorId: "user-4",
    type: "photo",
    content: "/moments/pasta.jpg",
    caption: "Letzte Woche: unsere erste gemeinsame Pasta-Nacht",
    reactions: { "user-me": "😊", "user-1": "❤️", "user-3": "👏" },
    createdAt: "2026-08-10T21:15:00",
  },
  {
    id: "moment-3",
    circleId: "circle-1",
    authorId: "user-me",
    type: "text",
    content: "Danke für letzten Sonntag — hat sich richtig gut angefühlt, Teil vom Kreis zu sein.",
    reactions: { "user-1": "❤️", "user-4": "🫶" },
    createdAt: "2026-08-11T09:00:00",
  },
];

export const initialAppState: AppState = {
  currentUser,
  circles,
  meetups,
  moments,
  joinedCircleIds: ["circle-1"],
  dailySuggestionsShown: 0,
};

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getCircleById(id: string): Circle | undefined {
  return circles.find((c) => c.id === id);
}

export function getMeetupById(id: string): Meetup | undefined {
  return meetups.find((m) => m.id === id);
}

export function getMomentsForCircle(circleId: string): Moment[] {
  return moments
    .filter((m) => m.circleId === circleId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getJoinedCircles(state: AppState): Circle[] {
  return state.circles.filter((c) => state.joinedCircleIds.includes(c.id));
}

export function getDiscoverySuggestions(state: AppState): Circle[] {
  return state.circles.filter((c) => !state.joinedCircleIds.includes(c.id));
}

export const formatLabels: Record<string, string> = {
  kochen: "Gemeinsam kochen",
  fotowalk: "Foto- & Stadtwalk",
  bewegung: "Leichte Bewegung",
};

export const formatIcons: Record<string, string> = {
  kochen: "🍳",
  fotowalk: "📷",
  bewegung: "🚶",
};

export const energyLabels: Record<string, string> = {
  ruhig: "Ruhig & entspannt",
  ausgeglichen: "Ausgeglichen",
  aktiv: "Aktiv & energiegeladen",
};
