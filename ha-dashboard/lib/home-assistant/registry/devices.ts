import { callHAWebSocket } from "../websocket";
import type { HADeviceRegistryEntry } from "./types";

export function getDevices(): Promise<HADeviceRegistryEntry[]> {
  return callHAWebSocket<HADeviceRegistryEntry[]>({
    type: "config/device_registry/list",
  });
}