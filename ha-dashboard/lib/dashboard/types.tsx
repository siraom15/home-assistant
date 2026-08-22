import type {
  HAAreaRegistryEntry,
  HADeviceRegistryEntry,
  HAEntityRegistryEntry,
} from "../home-assistant/register/types";
import { HAState } from "../home-assistant/types";

export interface HABootstrap {
  states: HAState[];

  areas: HAAreaRegistryEntry[];

  devices: HADeviceRegistryEntry[];

  entities: HAEntityRegistryEntry[];
}