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

  area_id: string | null;

  name: string | null;
  name_by_user: string | null;

  manufacturer: string | null;
  model: string | null;
  model_id: string | null;

  hw_version: string | null;
  sw_version: string | null;
  serial_number: string | null;

  configuration_url: string | null;

  via_device_id: string | null;

  disabled_by: string | null;

  entry_type: string | null;

  config_entry_id: string | null;
  config_subentry_id: string | null;

  config_entries: string[];

  config_entries_subentries: Record<
    string,
    Array<string | null>
  >;

  primary_config_entry: string | null;

  connections: Array<[string, string]>;
  identifiers: Array<[string, string]>;

  labels: string[];

  created_at: number;
  modified_at: number;
}

export interface HAEntityRegistryEntry {
  id: string;

  entity_id: string;
  unique_id: string | null;

  platform: string;

  area_id: string | null;
  device_id: string | null;

  name: string | null;
  original_name: string | null;

  icon: string | null;

  disabled_by: string | null;
  hidden_by: string | null;

  entity_category: string | null;

  has_entity_name: boolean;

  config_entry_id: string | null;
  config_subentry_id: string | null;

  translation_key: string | null;

  labels: string[];

  categories: Record<string, unknown>;

  options: Record<string, unknown>;

  created_at: number;
  modified_at: number;
}