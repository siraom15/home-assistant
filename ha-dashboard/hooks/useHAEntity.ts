"use client";

import { useHAStates } from "@/components/HAStateProvider";

export function useHAEntity(
  entityId: string
) {
  const { states } = useHAStates();

  return states[entityId];
}