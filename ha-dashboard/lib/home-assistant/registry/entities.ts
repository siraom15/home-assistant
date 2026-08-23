import { callHAWebSocket } from "../websocket";
import type { HAEntityRegistryEntry } from "./types";

export function getEntities(): Promise<
  HAEntityRegistryEntry[]
> {
  return callHAWebSocket<
    HAEntityRegistryEntry[]
  >({
    type: "config/entity_registry/list",
  });
}