import type { DashboardEntity } from "@/lib/dashboard/types";

interface UnknownEntityCardProps {
  entity: DashboardEntity;
}

export function UnknownEntityCard({
  entity,
}: UnknownEntityCardProps) {
  return (
    <div className="rounded-xl border p-4">
      <div className="font-medium">
        {entity.name}
      </div>

      <div className="mt-1 text-sm opacity-60">
        {entity.entityId}
      </div>

      <div className="mt-2 text-xs opacity-50">
        Unsupported domain: {entity.domain}
      </div>
    </div>
  );
}