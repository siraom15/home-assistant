"use client";

import { useHAStates } from "./useHAState";

export function useHAEntity(
  entityId: string,
) {
  const states = useHAStates();

  return states[entityId];
}