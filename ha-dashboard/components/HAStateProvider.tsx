"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { HAState } from "@/lib/home-assistant/types";

interface HAStateContextValue {
  states: Record<string, HAState>; // ex. {'light.living_room' : state}
}

const HAStateContext = createContext<HAStateContextValue | null>(null);

interface HAStateProviderProps {
  initialStates: HAState[];
  children: ReactNode;
}

export function HAStateProvider({
  initialStates,
  children,
}: HAStateProviderProps) {
  const [states, setStates] = useState<Record<string, HAState>>(() => {
    return Object.fromEntries(
      initialStates.map((state) => [
        state.entity_id,
        state,
      ])
    );
  });

  useEffect(() => {
    const eventSource = new EventSource(
      "/api/ha/events"
    );

    eventSource.onmessage = (event) => {
      const nextState = JSON.parse(
        event.data
      ) as HAState;

      setStates((current) => ({
        ...current,
        [nextState.entity_id]: nextState,
      }));
    };

    eventSource.onerror = (error) => {
      console.error(
        "Home Assistant event stream error:",
        error
      );
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const value = useMemo(
    () => ({
      states,
    }),
    [states]
  );

  return (
    <HAStateContext.Provider value={value}>
      {children}
    </HAStateContext.Provider>
  );
}

export function useHAStates() {
  const context = useContext(HAStateContext);

  if (!context) {
    throw new Error(
      "useHAStates must be used inside HAStateProvider"
    );
  }

  return context;
}