import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

import { CURRENT_USER_ID, resolveFormat } from "../domain/copy";
import { createInitialState, initialsFromName, todayKey } from "../domain/data";
import { upcomingMeetupForCircle } from "../domain/matching";
import type { AppAction, AppState } from "../domain/types";

const STORAGE_KEY = "kreis.ios.state.v1";

const paceFromLegacy: Record<string, "still" | "locker" | "schwung"> = {
  ruhig: "still",
  ausgeglichen: "locker",
  aktiv: "schwung",
  still: "still",
  locker: "locker",
  schwung: "schwung",
};

function normalizeState(state: AppState): AppState {
  const raw = state.currentUser.intention;
  const pace = raw.pace ?? paceFromLegacy[String(raw.energy ?? "locker")] ?? "locker";
  const formats = (raw.formats ?? []).map((item) => resolveFormat(item));
  return {
    ...state,
    currentUser: {
      ...state.currentUser,
      intention: { ...raw, pace, formats },
    },
    circles: state.circles.map((circle) => ({
      ...circle,
      format: resolveFormat(circle.format),
      season: { ...circle.season, format: resolveFormat(circle.season.format) },
    })),
    meetups: state.meetups.map((meetup) => ({
      ...meetup,
      attendance: meetup.attendance ?? {},
    })),
    flash: state.flash ?? null,
    sawHomeHint: state.sawHomeHint ?? true,
  };
}

function withDailyReset(state: AppState): AppState {
  const today = todayKey();
  if (state.suggestionDate === today) return state;
  return {
    ...state,
    suggestionDate: today,
    dismissedCircleIds: [],
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "HYDRATE":
      return withDailyReset(normalizeState(action.state));
    case "VERIFY_AGE":
      return { ...state, ageVerified: true };
    case "COMPLETE_ONBOARDING":
      return {
        ...state,
        onboardingComplete: true,
        sawHomeHint: false,
        flash: "Schön, dass du da bist. Als Nächstes: ein Abend.",
        currentUser: {
          ...state.currentUser,
          name: action.name,
          initials: initialsFromName(action.name),
          intention: action.intention,
        },
      };
    case "UPDATE_INTENTION":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          intention: { ...state.currentUser.intention, ...action.intention },
        },
      };
    case "UPDATE_NAME":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          name: action.name,
          initials: initialsFromName(action.name),
        },
      };
    case "JOIN_CIRCLE": {
      if (state.joinedCircleIds.includes(action.circleId)) return state;
      const joined = state.circles.find((circle) => circle.id === action.circleId);
      const hasUpcoming = joined ? Boolean(upcomingMeetupForCircle(state, joined.id)) : false;
      const flash = joined
        ? hasUpcoming
          ? `Du bist in „${joined.name}“. Sag zu, dann siehst du den Ort.`
          : `Du bist in „${joined.name}“. ${joined.hostName} legt den nächsten Abend fest.`
        : "Du bist im Kreis.";
      return {
        ...state,
        flash,
        joinedCircleIds: [...state.joinedCircleIds, action.circleId],
        circles: state.circles.map((circle) =>
          circle.id === action.circleId &&
          !circle.memberIds.includes(state.currentUser.id)
            ? { ...circle, memberIds: [...circle.memberIds, state.currentUser.id] }
            : circle
        ),
      };
    }
    case "LEAVE_CIRCLE":
      return {
        ...state,
        joinedCircleIds: state.joinedCircleIds.filter((id) => id !== action.circleId),
        circles: state.circles.map((circle) =>
          circle.id === action.circleId
            ? {
                ...circle,
                memberIds: circle.memberIds.filter((id) => id !== state.currentUser.id),
              }
            : circle
        ),
      };
    case "UPDATE_RSVP": {
      const flash =
        action.status === "yes"
          ? "Zugesagt. Der Treffpunkt ist jetzt sichtbar."
          : action.status === "maybe"
            ? "Alles gut — du kannst später noch fest zusagen."
            : "Absage ist angekommen.";
      return {
        ...state,
        flash,
        meetups: state.meetups.map((meetup) =>
          meetup.id === action.meetupId
            ? {
                ...meetup,
                rsvps: {
                  ...meetup.rsvps,
                  [state.currentUser.id]: action.status,
                },
              }
            : meetup
        ),
      };
    }
    case "CHECK_IN": {
      const firstHere =
        !state.meetups.some((meetup) => meetup.attendance?.[state.currentUser.id] === "here");
      return {
        ...state,
        flash: firstHere
          ? "Du warst wirklich da. Abzeichen: Schon da gewesen."
          : "Schön, dass du da bist.",
        meetups: state.meetups.map((meetup) =>
          meetup.id === action.meetupId
            ? {
                ...meetup,
                attendance: {
                  ...meetup.attendance,
                  [state.currentUser.id]: "here",
                },
              }
            : meetup
        ),
      };
    }
    case "SET_ATTENDANCE":
      return {
        ...state,
        flash: action.status === "here" ? "Als da gespeichert." : "Als nicht gekommen gespeichert.",
        meetups: state.meetups.map((meetup) =>
          meetup.id === action.meetupId
            ? {
                ...meetup,
                attendance: {
                  ...meetup.attendance,
                  [action.userId]: action.status,
                },
              }
            : meetup
        ),
      };
    case "ADD_MOMENT":
      return {
        ...state,
        moments: [
          {
            id: `moment-${Date.now()}`,
            circleId: action.circleId,
            authorId: state.currentUser.id,
            type: "text",
            content: action.content,
            reactions: {},
            createdAt: new Date().toISOString(),
          },
          ...state.moments,
        ],
      };
    case "DISMISS_CIRCLE":
      return {
        ...state,
        dismissedCircleIds: [...state.dismissedCircleIds, action.circleId],
      };
    case "REPORT_CIRCLE":
      return {
        ...state,
        reports: [
          {
            id: `report-${Date.now()}`,
            circleId: action.circleId,
            reason: action.reason,
            createdAt: new Date().toISOString(),
          },
          ...state.reports,
        ],
      };
    case "RATE_MEETUP": {
      const firstRepeat = action.rating.wouldRepeat && !state.ratings.some((item) => item.wouldRepeat);
      const flash = action.rating.wouldRepeat
        ? firstRepeat
          ? "Schön. Abzeichen: Würde wiederkommen."
          : "Danke. Das hilft dem Kreis beim nächsten Mal."
        : "Danke für die ehrliche Antwort.";
      return {
        ...state,
        flash,
        ratings: [
          ...state.ratings.filter((item) => item.meetupId !== action.rating.meetupId),
          action.rating,
        ],
      };
    }
    case "SCHEDULE_NEXT_MEETUP": {
      const circle = state.circles.find((item) => item.id === action.circleId);
      if (!circle || circle.hostId !== state.currentUser.id) return state;
      const id = `meetup-${action.circleId}-${Date.now()}`;
      const nextWeek = Math.min(circle.season.totalWeeks, Math.max(1, circle.season.weekNumber + 1));
      return {
        ...state,
        flash: "Nächstes Treffen steht. Die Runde kann zusagen.",
        meetups: [
          ...state.meetups,
          {
            id,
            circleId: circle.id,
            title: action.title,
            date: action.date,
            time: action.time,
            location: action.location,
            locationHint: "Genauer Treffpunkt wird erst nach deiner Zusage sichtbar.",
            minDurationMinutes: 90,
            attendance: {},
            rsvps: { [state.currentUser.id]: "yes" },
          },
        ],
        circles: state.circles.map((item) =>
          item.id === circle.id
            ? {
                ...item,
                nextMeetupId: id,
                season: { ...item.season, weekNumber: nextWeek },
              }
            : item
        ),
      };
    }
    case "UPDATE_MEETUP": {
      const meetup = state.meetups.find((item) => item.id === action.meetupId);
      if (!meetup) return state;
      const circle = state.circles.find((item) => item.id === meetup.circleId);
      if (!circle || circle.hostId !== state.currentUser.id) return state;
      return {
        ...state,
        flash: "Treffen ist geändert.",
        meetups: state.meetups.map((item) =>
          item.id === action.meetupId
            ? {
                ...item,
                title: action.title,
                date: action.date,
                time: action.time,
                location: action.location,
              }
            : item
        ),
      };
    }
    case "ENSURE_HOST_CIRCLE": {
      if (state.circles.some((circle) => circle.hostId === state.currentUser.id)) return state;
      const format = state.currentUser.intention.formats[0] ?? "kochen";
      const id = `circle-host-${state.currentUser.id}`;
      const circle = {
        id,
        name: `Runde mit ${state.currentUser.name}`,
        format,
        description: "Dein Kreis. Du lädst ein, die anderen sagen zu.",
        neighborhood: state.currentUser.intention.neighborhood || "Prenzlauer Berg",
        memberIds: [state.currentUser.id],
        maxMembers: 6,
        hostName: state.currentUser.name,
        hostId: state.currentUser.id,
        nextMeetupId: "",
        season: {
          id: `season-${id}`,
          circleId: id,
          name: "Erste Saison",
          format,
          startDate: todayKey(),
          endDate: todayKey(),
          ritual: "Ein Abend, dann der nächste.",
          weekNumber: 0,
          totalWeeks: 4,
        },
      };
      return {
        ...state,
        flash: "Dein Kreis steht. Leg das erste Treffen fest.",
        circles: [...state.circles, circle],
        joinedCircleIds: state.joinedCircleIds.includes(id)
          ? state.joinedCircleIds
          : [...state.joinedCircleIds, id],
      };
    }
    case "SET_DIGEST":
      return { ...state, settings: { ...state.settings, digest: action.digest } };
    case "SET_PERSONALIZATION":
      return {
        ...state,
        settings: { ...state.settings, personalizationEnabled: action.enabled },
      };
    case "CLEAR_FLASH":
      return { ...state, flash: null };
    case "DISMISS_HOME_HINT":
      return { ...state, sawHomeHint: true };
    case "RESET_PERSONALIZATION":
      return {
        ...withDailyReset({
          ...state,
          dismissedCircleIds: [],
          settings: { ...state.settings, personalizationEnabled: true },
        }),
      };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  hydrated: boolean;
  dispatch: (action: AppAction) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw || cancelled) return;
        const parsed = JSON.parse(raw) as AppState;
        if (parsed?.currentUser?.id === CURRENT_USER_ID) {
          dispatch({ type: "HYDRATE", state: parsed });
        }
      } catch {
        // Keep the seeded Berlin-pilot state if storage is unreadable.
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, flash: null }));
  }, [state, hydrated]);

  const value = useMemo(
    () => ({ state, hydrated, dispatch }),
    [state, hydrated]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

export function useResetDemo() {
  const { dispatch } = useApp();
  return useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "HYDRATE", state: createInitialState() });
  }, [dispatch]);
}
