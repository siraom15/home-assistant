import type {
  HAAreaRegistryEntry,
  HADeviceRegistryEntry,
  HAEntityRegistryEntry,
} from "./register/types";

export interface HAState {
  entity_id: string;
  state: string;
  attributes: Record<string, any>
  last_changed: string;
  last_updated: string;
  context: HAContext
}

export interface HAContext{
   id: string,
    parent_id: string | null,
    user_id: string | null
}
export interface HABootstrap {
  states: HAState[];

  areas: HAAreaRegistryEntry[];

  devices: HADeviceRegistryEntry[];

  entities: HAEntityRegistryEntry[];
}