export interface HAAreaRegistryEntry {
  area_id: string;
  name: string;

  picture?: string | null;
  icon?: string | null;

  aliases?: string[];

  floor_id?: string | null;

  labels?: string[];
}

export interface HADeviceRegistryEntry {
  id: string;

  area_id?: string | null;

  name?: string | null;
  name_by_user?: string | null;

  manufacturer?: string | null;
  model?: string | null;
  model_id?: string | null;

  hw_version?: string | null;
  sw_version?: string | null;

  serial_number?: string | null;

  configuration_url?: string | null;

  via_device_id?: string | null;

  disabled_by?: string | null;

  labels?: string[];
}

export interface HAEntityRegistryEntry {
  entity_id: string;

  platform: string;

  area_id?: string | null;
  device_id?: string | null;

  name?: string | null;
  original_name?: string | null;

  icon?: string | null;
  original_icon?: string | null;

  disabled_by?: string | null;
  hidden_by?: string | null;

  entity_category?: string | null;

  labels?: string[];

  has_entity_name?: boolean;
}