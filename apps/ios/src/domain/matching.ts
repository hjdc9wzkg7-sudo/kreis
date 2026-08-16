import { MAX_DAILY_SUGGESTIONS, formatLabels, resolveFormat } from "./copy";
import type { AppState, Circle, Meetup, User } from "./types";

export interface ExplainedSuggestion {
  circle: Circle;
  score: number;
  reasons: string[];
}

export function intentionPace(user: User) {
  return user.intention.pace ?? user.intention.energy ?? "locker";
}

export function explainCircle(user: User, circle: Circle): ExplainedSuggestion {
  const { intention } = user;
  const reasons: string[] = [];
  let score = 0;

  if (intention.neighborhood === circle.neighborhood) {
    score += 3;
    reasons.push(`In ${circle.neighborhood}`);
  }

  if (intention.formats.includes(circle.format)) {
    score += 3;
    reasons.push(formatLabels[resolveFormat(circle.format)]);
  }

  const pace = intentionPace(user);
  if (pace === "still") {
    score += 1;
    reasons.push("Kleine Runde, zuhören geht");
  } else if (pace === "schwung") {
    score += 1;
    reasons.push("Platz für deine Ideen");
  } else {
    score += 2;
    reasons.push("Lockeres Tempo");
  }

  return { circle, score, reasons: reasons.slice(0, 1) };
}

export function getJoinedCircles(state: AppState): Circle[] {
  return state.circles.filter((circle) => state.joinedCircleIds.includes(circle.id));
}

export function getDailySuggestions(state: AppState): ExplainedSuggestion[] {
  if (!state.settings.personalizationEnabled) {
    return state.circles
      .filter(
        (circle) =>
          !state.joinedCircleIds.includes(circle.id) &&
          !state.dismissedCircleIds.includes(circle.id) &&
          circle.memberIds.length < circle.maxMembers
      )
      .slice(0, MAX_DAILY_SUGGESTIONS)
      .map((circle) => ({
        circle,
        score: 0,
        reasons: [`In ${circle.neighborhood}`],
      }));
  }

  return state.circles
    .filter(
      (circle) =>
        !state.joinedCircleIds.includes(circle.id) &&
        !state.dismissedCircleIds.includes(circle.id) &&
        circle.memberIds.length < circle.maxMembers
    )
    .map((circle) => explainCircle(state.currentUser, circle))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_DAILY_SUGGESTIONS);
}

export function nextMeetupFor(state: AppState) {
  const joined = getJoinedCircles(state);
  const meetups = joined
    .map((circle) => ({
      circle,
      meetup: upcomingMeetupForCircle(state, circle.id),
    }))
    .filter((item): item is { circle: Circle; meetup: Meetup } => Boolean(item.meetup))
    .sort((a, b) => meetupStart(a.meetup).getTime() - meetupStart(b.meetup).getTime());
  return meetups[0];
}

export function lastEndedMeetupFor(state: AppState) {
  const joined = getJoinedCircles(state);
  const meetups = joined
    .flatMap((circle) =>
      state.meetups
        .filter((meetup) => meetup.circleId === circle.id && hasMeetupEnded(meetup))
        .map((meetup) => ({ circle, meetup }))
    )
    .sort((a, b) => meetupEnd(b.meetup).getTime() - meetupEnd(a.meetup).getTime());
  return meetups[0];
}

export function upcomingMeetupForCircle(state: AppState, circleId: string): Meetup | undefined {
  return state.meetups
    .filter((meetup) => meetup.circleId === circleId && !hasMeetupEnded(meetup))
    .sort((a, b) => meetupStart(a).getTime() - meetupStart(b).getTime())[0];
}

export function lastEndedMeetupForCircle(state: AppState, circleId: string): Meetup | undefined {
  return state.meetups
    .filter((meetup) => meetup.circleId === circleId && hasMeetupEnded(meetup))
    .sort((a, b) => meetupEnd(b).getTime() - meetupEnd(a).getTime())[0];
}

export function attendedMeetup(meetup: Meetup, userId: string): boolean {
  return meetup.rsvps[userId] === "yes" || meetup.attendance?.[userId] === "here";
}

export function isMeetupRated(state: AppState, meetupId: string): boolean {
  return state.ratings.some((item) => item.meetupId === meetupId);
}

export function lastEndedAttendedFor(state: AppState) {
  const userId = state.currentUser.id;
  const joined = getJoinedCircles(state);
  const meetups = joined
    .flatMap((circle) =>
      state.meetups
        .filter((meetup) => meetup.circleId === circle.id && hasMeetupEnded(meetup) && attendedMeetup(meetup, userId))
        .map((meetup) => ({ circle, meetup }))
    )
    .sort((a, b) => meetupEnd(b.meetup).getTime() - meetupEnd(a.meetup).getTime());
  return meetups[0];
}

export function hostedCircles(state: AppState): Circle[] {
  return state.circles.filter((circle) => circle.hostId === state.currentUser.id);
}

export function hostedCircleNeedingSchedule(state: AppState): Circle | undefined {
  return hostedCircles(state).find((circle) => !upcomingMeetupForCircle(state, circle.id));
}

export type HomePhase =
  | { kind: "upcoming"; circle: Circle; meetup: Meetup }
  | { kind: "rate"; circle: Circle; meetup: Meetup }
  | { kind: "schedule"; circle: Circle; last?: Meetup }
  | { kind: "waiting"; circle: Circle; meetup: Meetup }
  | { kind: "invite"; suggestion: ExplainedSuggestion; last?: { circle: Circle; meetup: Meetup } }
  | { kind: "pause" };

export function homePhase(state: AppState): HomePhase {
  const upcoming = nextMeetupFor(state);
  if (upcoming) return { kind: "upcoming", ...upcoming };

  const attended = lastEndedAttendedFor(state);
  if (attended && !isMeetupRated(state, attended.meetup.id)) {
    return { kind: "rate", ...attended };
  }

  const last = lastEndedMeetupFor(state);
  const suggestion = getDailySuggestions(state)[0];
  if (suggestion) {
    return { kind: "invite", suggestion, last };
  }

  const hostGap = hostedCircleNeedingSchedule(state);
  if (hostGap) {
    return { kind: "schedule", circle: hostGap, last: lastEndedMeetupForCircle(state, hostGap.id) };
  }

  if (last && !upcomingMeetupForCircle(state, last.circle.id)) {
    return { kind: "waiting", ...last };
  }

  return { kind: "pause" };
}

export function addDaysIso(days: number, from = new Date()): string {
  const value = new Date(from);
  value.setDate(value.getDate() + days);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function upcomingDayOptions(count = 8, from = new Date()): { date: string; label: string }[] {
  return Array.from({ length: count }, (_, index) => {
    const date = addDaysIso(index, from);
    const label = new Date(`${date}T12:00:00`).toLocaleDateString("de-DE", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
    });
    return { date, label };
  });
}

export function meetupStart(meetup: Meetup): Date {
  return new Date(`${meetup.date}T${meetup.time}:00`);
}

export function meetupEnd(meetup: Meetup): Date {
  return new Date(meetupStart(meetup).getTime() + meetup.minDurationMinutes * 60_000);
}

export function hasMeetupStarted(meetup: Meetup, now = new Date()): boolean {
  return now >= meetupStart(meetup);
}

export function hasMeetupEnded(meetup: Meetup, now = new Date()): boolean {
  return now >= meetupEnd(meetup);
}

export function daysUntil(meetup: Meetup, now = new Date()): string {
  const start = meetupStart(meetup);
  const diff = Math.round((start.getTime() - now.getTime()) / 86_400_000);
  if (diff < 0) return "war schon";
  if (diff === 0) return "heute";
  if (diff === 1) return "morgen";
  return `in ${diff} Tagen`;
}

export function formatMeetupDate(date: string, time: string): string {
  const value = new Date(`${date}T${time}:00`);
  return value.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function greeting(name: string, now = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return `Guten Morgen, ${name}`;
  if (hour < 18) return `Hey ${name}`;
  return `Schöner Abend, ${name}`;
}

export function openSeatsLabel(circle: Circle): string {
  const taken = circle.memberIds.length;
  const free = circle.maxMembers - taken;
  if (free <= 0) return `${taken} von ${circle.maxMembers} Plätzen vergeben`;
  return `${taken} von ${circle.maxMembers} Plätzen belegt · ${free} frei`;
}
