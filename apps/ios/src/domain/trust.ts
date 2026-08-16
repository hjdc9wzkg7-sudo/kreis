import type { AppState, Circle, FormatType } from "./types";

export interface TrustMark {
  id: string;
  title: string;
  hint: string;
  earned: boolean;
}

export interface Reputation {
  confirmedMeetups: number;
  hostedSeasons: number;
  wouldRepeatCount: number;
  reliabilityPercent: number | null;
  marks: TrustMark[];
  hostedCircles: Circle[];
  guestCircles: Circle[];
  formats: FormatType[];
}

export function getReputation(state: AppState): Reputation {
  const userId = state.currentUser.id;
  const hostedCircles = state.circles.filter((circle) => circle.hostId === userId);
  const guestCircles = state.circles.filter(
    (circle) =>
      state.joinedCircleIds.includes(circle.id) && circle.hostId !== userId
  );

  const myRsvps = state.meetups.flatMap((meetup) => {
    const status = meetup.rsvps[userId];
    return status ? [{ meetup, status }] : [];
  });
  const showedUp = state.meetups.filter((meetup) => meetup.attendance?.[userId] === "here").length;
  const confirmedMeetups = showedUp;
  const decided = myRsvps.filter((item) => item.status === "yes" || item.status === "no");
  const noShows = state.meetups.filter((meetup) => meetup.attendance?.[userId] === "no_show").length;
  const reliabilityPercent =
    showedUp + noShows > 0
      ? Math.round((showedUp / (showedUp + noShows)) * 100)
      : decided.length === 0
        ? null
        : Math.round((myRsvps.filter((item) => item.status === "yes").length / decided.length) * 100);

  const wouldRepeatCount = state.ratings.filter((item) => item.wouldRepeat).length;

  const marks: TrustMark[] = [
    {
      id: "dabei",
      title: "Schon da gewesen",
      hint: "Du warst bei mindestens einem Abend wirklich dabei.",
      earned: showedUp > 0,
    },
    {
      id: "wiederkehr",
      title: "Würde wiederkommen",
      hint: "Du hast nach einem Abend gesagt: das mache ich wieder.",
      earned: wouldRepeatCount > 0,
    },
    {
      id: "host",
      title: "Hat schon mal eingeladen",
      hint: "Du hast mindestens einen Kreis geführt.",
      earned: hostedCircles.length > 0,
    },
    {
      id: "reliable",
      title: "Kommt, wenn sie zusagt",
      hint: "Wenn du zusagst, tauchst du auch auf.",
      earned: confirmedMeetups >= 2 && (reliabilityPercent ?? 0) >= 80,
    },
    {
      id: "saison",
      title: "Mehr als einmal da",
      hint: "Du bleibst über mehrere Wochen in einem Kreis.",
      earned: guestCircles.some((circle) => circle.season.weekNumber >= 2) || hostedCircles.length > 0,
    },
  ];

  return {
    confirmedMeetups,
    hostedSeasons: hostedCircles.length,
    wouldRepeatCount,
    reliabilityPercent,
    marks,
    hostedCircles,
    guestCircles,
    formats: state.currentUser.intention.formats,
  };
}
