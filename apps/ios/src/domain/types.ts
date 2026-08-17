export type SocialPace = "still" | "locker" | "schwung";
export type Availability = "wochentags" | "wochenende" | "flexibel";
export type FormatType = "kochen" | "stadtrundgang" | "bewegung" | "cafe" | "sprache" | "kreativ";
export type RsvpStatus = "pending" | "yes" | "no" | "maybe";
export type AttendanceStatus = "here" | "no_show";
export type MomentType = "photo" | "voice" | "text";

export interface UserIntention {
  pace: SocialPace;
  energy?: SocialPace;
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

export interface Meetup {
  id: string;
  circleId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  locationHint: string;
  rsvps: Record<string, RsvpStatus>;
  attendance: Record<string, AttendanceStatus>;
  minDurationMinutes: number;
}

export interface Moment {
  id: string;
  circleId: string;
  authorId: string;
  type: MomentType;
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
  hostName: string;
  hostId: string;
}

export interface HostKit {
  id: string;
  title: string;
  format: FormatType;
  duration: string;
  groupSize: string;
  summary: string;
  steps: string[];
  safetyNotes: string[];
  verified: boolean;
}

export interface MeetupRating {
  meetupId: string;
  wouldRepeat: boolean;
}

export interface Report {
  id: string;
  circleId: string;
  reason: string;
  createdAt: string;
}

export interface AppSettings {
  personalizationEnabled: boolean;
}

export interface AppState {
  currentUser: User;
  circles: Circle[];
  meetups: Meetup[];
  moments: Moment[];
  joinedCircleIds: string[];
  ageVerified: boolean;
  onboardingComplete: boolean;
  suggestionDate: string;
  dismissedCircleIds: string[];
  reports: Report[];
  ratings: MeetupRating[];
  settings: AppSettings;
  flash: string | null;
  sawHomeHint: boolean;
}

export type AppAction =
  | { type: "HYDRATE"; state: AppState }
  | { type: "VERIFY_AGE" }
  | { type: "COMPLETE_ONBOARDING"; name: string; intention: UserIntention }
  | { type: "UPDATE_INTENTION"; intention: Partial<UserIntention> }
  | { type: "UPDATE_NAME"; name: string }
  | { type: "JOIN_CIRCLE"; circleId: string }
  | { type: "LEAVE_CIRCLE"; circleId: string }
  | { type: "UPDATE_RSVP"; meetupId: string; status: RsvpStatus }
  | { type: "CHECK_IN"; meetupId: string }
  | { type: "SET_ATTENDANCE"; meetupId: string; userId: string; status: AttendanceStatus }
  | { type: "ADD_MOMENT"; circleId: string; content: string }
  | { type: "DISMISS_CIRCLE"; circleId: string }
  | { type: "REPORT_CIRCLE"; circleId: string; reason: string }
  | { type: "RATE_MEETUP"; rating: MeetupRating }
  | { type: "SET_PERSONALIZATION"; enabled: boolean }
  | { type: "RESET_PERSONALIZATION" }
  | { type: "CLEAR_FLASH" }
  | { type: "DISMISS_HOME_HINT" }
  | {
      type: "SCHEDULE_NEXT_MEETUP";
      circleId: string;
      title: string;
      date: string;
      time: string;
      location: string;
    }
  | {
      type: "UPDATE_MEETUP";
      meetupId: string;
      title: string;
      date: string;
      time: string;
      location: string;
    }
  | { type: "ENSURE_HOST_CIRCLE" };
