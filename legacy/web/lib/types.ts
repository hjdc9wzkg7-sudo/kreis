export type EnergyLevel = "ruhig" | "ausgeglichen" | "aktiv";
export type Availability = "wochentags" | "wochenende" | "flexibel";
export type FormatType = "kochen" | "fotowalk" | "bewegung";

export interface UserIntention {
  energy: EnergyLevel;
  availability: Availability;
  language: string;
  neighborhood: string;
  formats: FormatType[];
  bio: string;
}

export interface User {
  id: string;
  name: string;
  initials: string;
  intention: UserIntention;
}

export type RsvpStatus = "pending" | "yes" | "no" | "maybe";

export interface Meetup {
  id: string;
  circleId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  locationHint: string;
  rsvps: Record<string, RsvpStatus>;
}

export interface Moment {
  id: string;
  circleId: string;
  authorId: string;
  type: "photo" | "voice" | "text";
  content: string;
  caption?: string;
  reactions: Record<string, string>;
  createdAt: string;
}

export interface Season {
  id: string;
  circleId: string;
  name: string;
  format: FormatType;
  startDate: string;
  endDate: string;
  ritual: string;
  weekNumber: number;
  totalWeeks: number;
}

export interface Circle {
  id: string;
  name: string;
  format: FormatType;
  description: string;
  neighborhood: string;
  memberIds: string[];
  maxMembers: number;
  season: Season;
  nextMeetupId: string;
  whyMatch: string[];
  hostName: string;
}

export interface DiscoverySuggestion {
  circle: Circle;
  matchScore: number;
  reason: string;
}

export interface AppState {
  currentUser: User;
  circles: Circle[];
  meetups: Meetup[];
  moments: Moment[];
  joinedCircleIds: string[];
  dailySuggestionsShown: number;
}
