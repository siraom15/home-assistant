"use client";

import {
  useEffect,
  useState,
} from "react";

import type { HAState } from "@/lib/home-assistant/types";

export function useHAState(
  initialState: HAState
) {
  const [state, setState] =
    useState(initialState);

  useEffect(() => {
    const eventSource = new EventSource(
      "/api/ha/events"
    );

    eventSource.onmessage = (event) => {
      const nextState = JSON.parse(
        event.data
      ) as HAState;

      if (
        nextState.entity_id ===
        initialState.entity_id
      ) {
        setState(nextState);
      }
    };

    eventSource.onerror = (error) => {
      console.error(
        "HA event stream error:",
        error
      );
    };

    return () => {
      eventSource.close();
    };
  }, [initialState.entity_id]);

  return state;
}