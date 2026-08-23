import { callHAWebSocket } from "../websocket";
import type { HAAreaRegistryEntry } from "./types";

export function getAreas(): Promise<HAAreaRegistryEntry[]> {
  return callHAWebSocket<HAAreaRegistryEntry[]>({
    type: "config/area_registry/list",
  });
}