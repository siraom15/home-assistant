import type {
  HAAreaRegistryEntry,
  HADeviceRegistryEntry,
  HAEntityRegistryEntry,
} from "./types";

export interface ResolvedEntityArea {
  areaId: string | null;
  area: HAAreaRegistryEntry | null;
  source: "entity" | "device" | "unassigned";
}

export function resolveEntityArea(
  entity: HAEntityRegistryEntry,
  devices: HADeviceRegistryEntry[],
  areas: HAAreaRegistryEntry[],
): ResolvedEntityArea {
  // 1. Entity-level area wins
  if (entity.area_id) {
    const area =
      areas.find(
        (area) => area.area_id === entity.area_id,
      ) ?? null;

    return {
      areaId: entity.area_id,
      area,
      source: "entity",
    };
  }

  // 2. Otherwise inherit area from device
  if (entity.device_id) {
    const device = devices.find(
      (device) => device.id === entity.device_id,
    );

    if (device?.area_id) {
      const area =
        areas.find(
          (area) => area.area_id === device.area_id,
        ) ?? null;

      return {
        areaId: device.area_id,
        area,
        source: "device",
      };
    }
  }

  // 3. No area information
  return {
    areaId: null,
    area: null,
    source: "unassigned",
  };
}

export function groupEntitiesByArea(
  entities: HAEntityRegistryEntry[],
  devices: HADeviceRegistryEntry[],
  areas: HAAreaRegistryEntry[],
) {
  const grouped = new Map<
    string,
    HAEntityRegistryEntry[]
  >();

  const unassigned: HAEntityRegistryEntry[] = [];

  for (const entity of entities) {
    const resolved = resolveEntityArea(
      entity,
      devices,
      areas,
    );

    if (!resolved.areaId) {
      unassigned.push(entity);
      continue;
    }

    const current =
      grouped.get(resolved.areaId) ?? [];

    current.push(entity);

    grouped.set(
      resolved.areaId,
      current,
    );
  }

  return {
    grouped,
    unassigned,
  };
}