"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type { AppState, RsvpStatus, UserIntention } from "./types";
import { initialAppState } from "./data";

type Action =
  | { type: "UPDATE_INTENTION"; intention: Partial<UserIntention> }
  | { type: "JOIN_CIRCLE"; circleId: string }
  | { type: "LEAVE_CIRCLE"; circleId: string }
  | { type: "UPDATE_RSVP"; meetupId: string; status: RsvpStatus }
  | { type: "ADD_MOMENT"; circleId: string; content: string }
  | { type: "ADD_REACTION"; momentId: string; emoji: string }
  | { type: "INCREMENT_SUGGESTIONS" };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "UPDATE_INTENTION":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          intention: { ...state.currentUser.intention, ...action.intention },
        },
      };
    case "JOIN_CIRCLE":
      return {
        ...state,
        joinedCircleIds: [...state.joinedCircleIds, action.circleId],
      };
    case "LEAVE_CIRCLE":
      return {
        ...state,
        joinedCircleIds: state.joinedCircleIds.filter(
          (id) => id !== action.circleId
        ),
      };
    case "UPDATE_RSVP":
      return {
        ...state,
        meetups: state.meetups.map((m) =>
          m.id === action.meetupId
            ? {
                ...m,
                rsvps: {
                  ...m.rsvps,
                  [state.currentUser.id]: action.status,
                },
              }
            : m
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
    case "ADD_REACTION":
      return {
        ...state,
        moments: state.moments.map((m) =>
          m.id === action.momentId
            ? {
                ...m,
                reactions: {
                  ...m.reactions,
                  [state.currentUser.id]: action.emoji,
                },
              }
            : m
        ),
      };
    case "INCREMENT_SUGGESTIONS":
      return {
        ...state,
        dailySuggestionsShown: state.dailySuggestionsShown + 1,
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
