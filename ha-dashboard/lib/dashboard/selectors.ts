import type {
  DashboardArea,
  DashboardEntity,
  DashboardModel,
} from "./types";

export function getAreaById(
  model: DashboardModel,
  areaId: string,
): DashboardArea | undefined {
  return model.areas.find(
    (area) => area.id === areaId,
  );
}

export function getEntitiesByDomain(
  entities: DashboardEntity[],
  domain: string,
): DashboardEntity[] {
  return entities.filter(
    (entity) => entity.domain === domain,
  );
}

export function getAreaLights(
  area: DashboardArea,
): DashboardEntity[] {
  return getEntitiesByDomain(
    area.entities,
    "light",
  );
}

export function getAreaSensors(
  area: DashboardArea,
): DashboardEntity[] {
  return area.entities.filter(
    (entity) =>
      entity.domain === "sensor" ||
      entity.domain === "binary_sensor",
  );
}

export function getAreaEntityCount(
  area: DashboardArea,
): number {
  return area.entities.length;
}