"use client";

import { useHAEntity } from "@/hooks/useHAEntity";
import { getEntityPresentation } from "@/lib/home-assistant/entity-presentation";

interface SensorCardProps {
  entityId: string;
  name: string;
}

export function SensorCard({
  entityId,
  name,
}: SensorCardProps) {
  const entity = useHAEntity(entityId);

  if (!entity) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-5">
        <p className="font-medium text-red-700">
          Entity not found
        </p>

        <p className="mt-1 text-xs text-red-500">
          {entityId}
        </p>
      </div>
    );
  }

  const presentation = getEntityPresentation(entity);

  const deviceClass =
    typeof entity.attributes.device_class === "string"
      ? entity.attributes.device_class
      : undefined;

  return (
    <div
      className={`
        rounded-3xl border p-5
        transition-all duration-300
        ${
          presentation.status === "active"
            ? "border-amber-300/50 bg-amber-50"
            : presentation.status === "unknown"
              ? "border-zinc-200 bg-zinc-100"
              : "border-zinc-200 bg-white"
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {deviceClass ?? "Sensor"}
          </p>

          <h2 className="mt-1 text-base font-semibold text-zinc-900">
            {name}
          </h2>

          <p className="mt-1 text-xs text-zinc-400">
            {entityId}
          </p>
        </div>

        <div
          className={`
            h-3 w-3 rounded-full
            ${
              presentation.status === "active"
                ? "bg-amber-400"
                : presentation.status === "unknown"
                  ? "bg-zinc-300"
                  : "bg-emerald-400"
            }
          `}
        />
      </div>

      <div className="mt-6">
        <p className="text-3xl font-semibold tracking-tight text-zinc-900">
          {presentation.value}

          {presentation.unit && (
            <span className="ml-2 text-lg font-medium text-zinc-400">
              {presentation.unit}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}