import type { DashboardArea } from "@/lib/dashboard/types";
import { EntityRenderer } from "../entities/EntityRenderer";

interface AreaSectionProps {
  area: DashboardArea;
}

export function AreaSection({
  area,
}: AreaSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">
          {area.name}
        </h2>

        <p className="text-sm text-zinc-500">
          {area.entities.length} entities
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {area.entities.map((entity) => (
          <EntityRenderer
            key={entity.entityId}
            entity={entity}
          />
        ))}
      </div>
    </section>
  );
}