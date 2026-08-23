import type { HABootstrap } from "@/lib/home-assistant/types";
import type { HAEntityRegistryEntry } from "@/lib/home-assistant/registry/types";
import { resolveEntityArea } from "@/lib/home-assistant/registry/resolver";

import type {
  DashboardArea,
  DashboardEntity,
  DashboardModel,
} from "./types";

export function buildDashboardModel(
  bootstrap: HABootstrap,
): DashboardModel {
  const areaMap = new Map<string, DashboardArea>();

  for (const area of bootstrap.areas) {
    areaMap.set(area.area_id, {
      id: area.area_id,
      name: area.name,
      icon: area.icon ?? null,
      entities: [],
    });
  }

  const unassigned: DashboardEntity[] = [];

  for (const entity of bootstrap.entities) {
    const dashboardEntity = toDashboardEntity(entity);

    const resolved = resolveEntityArea(
      entity,
      bootstrap.devices,
      bootstrap.areas,
    );

    if (!resolved.areaId) {
      unassigned.push(dashboardEntity);
      continue;
    }

    const area = areaMap.get(resolved.areaId);

    if (!area) {
      unassigned.push(dashboardEntity);
      continue;
    }

    area.entities.push({
      ...dashboardEntity,
      areaId: resolved.areaId,
    });
  }

  return {
    areas: Array.from(areaMap.values()),
    unassigned,
  };
}

function toDashboardEntity(
  entity: HAEntityRegistryEntry,
): DashboardEntity {
  const domain =
    entity.entity_id.split(".")[0] ?? "unknown";

  const name =
    entity.name ??
    entity.original_name ??
    entity.entity_id;

  return {
    entityId: entity.entity_id,
    domain,
    name,
    areaId: entity.area_id,
    deviceId: entity.device_id,
  };
}