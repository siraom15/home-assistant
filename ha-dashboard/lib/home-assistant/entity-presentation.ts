import type { HAState } from "./types";

export interface EntityPresentation {
  value: string;
  unit?: string;
  status: "normal" | "active" | "unknown";
}

export function getEntityPresentation(
  entity: HAState
): EntityPresentation {
  const deviceClass = entity.attributes.device_class;
  const unit = entity.attributes.unit_of_measurement;

  if (entity.state === "unknown" || entity.state === "unavailable") {
    return {
      value: entity.state,
      status: "unknown",
    };
  }

  if (entity.entity_id.startsWith("binary_sensor.")) {
    return getBinarySensorPresentation(
      entity.state,
      typeof deviceClass === "string"
        ? deviceClass
        : undefined
    );
  }

  return {
    value: entity.state,
    unit: typeof unit === "string" ? unit : undefined,
    status: "normal",
  };
}

function getBinarySensorPresentation(
  state: string,
  deviceClass?: string
): EntityPresentation {
  const active = state === "on";

  switch (deviceClass) {
    case "motion":
      return {
        value: active ? "Detected" : "Clear",
        status: active ? "active" : "normal",
      };

    case "occupancy":
      return {
        value: active ? "Occupied" : "Clear",
        status: active ? "active" : "normal",
      };

    case "door":
      return {
        value: active ? "Open" : "Closed",
        status: active ? "active" : "normal",
      };

    default:
      return {
        value: active ? "On" : "Off",
        status: active ? "active" : "normal",
      };
  }
}