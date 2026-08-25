"use client";

import { useHAStateContext } from "@/providers/HAStateProvider";

export function useHAStates() {
  return useHAStateContext().states;
}