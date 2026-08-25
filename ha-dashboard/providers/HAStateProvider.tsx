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
  states: Record<string, HAState>;
}

const HAStateContext =
  createContext<HAStateContextValue | null>(null);

interface HAStateProviderProps {
  initialStates: HAState[];
  children: ReactNode;
}

export function HAStateProvider({
  initialStates,
  children,
}: HAStateProviderProps) {
  const [states, setStates] = useState<
    Record<string, HAState>
  >(() =>
    Object.fromEntries(
      initialStates.map((state) => [
        state.entity_id,
        state,
      ]),
    ),
  );

  useEffect(() => {
    const eventSource =
      new EventSource("/api/ha/events");

    eventSource.onmessage = (event) => {
      const state = JSON.parse(
        event.data,
      ) as HAState;

      setStates((current) => ({
        ...current,
        [state.entity_id]: state,
      }));
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const value = useMemo(
    () => ({
      states,
    }),
    [states],
  );

  return (
    <HAStateContext.Provider value={value}>
      {children}
    </HAStateContext.Provider>
  );
}

export function useHAStateContext() {
  const context = useContext(HAStateContext);

  if (!context) {
    throw new Error(
      "useHAStateContext must be used inside HAStateProvider",
    );
  }

  return context;
}