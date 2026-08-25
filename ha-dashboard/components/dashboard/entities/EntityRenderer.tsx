"use client";

import type { DashboardEntity } from "@/lib/dashboard/types";

import { LightCard } from "./LightCard";
import { SensorCard } from "./SensorCard";
import { UnknownEntityCard } from "./UnknownEntityCard";

interface EntityRendererProps {
  entity: DashboardEntity;
}

export function EntityRenderer({
  entity,
}: EntityRendererProps) {
  switch (entity.domain) {
    case "light":
      return (
        <LightCard
          entityId={entity.entityId}
          name={entity.name}
        />
      );

    case "sensor":
    case "binary_sensor":
      return (
        <SensorCard
          entityId={entity.entityId}
          name={entity.name}
        />
      );

    default:
      return (
        <UnknownEntityCard entity={entity} />
      );
  }
}