import type { DashboardArea } from "@/lib/dashboard/types";
import { AreaSection } from "./AreaSection";

interface AreaGridProps {
  areas: DashboardArea[];
}

export function AreaGrid({
  areas,
}: AreaGridProps) {
  if (areas.length === 0) {
    return (
      <div className="rounded-xl border p-6 text-sm text-zinc-500">
        No areas found.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {areas.map((area) => (
        <AreaSection
          key={area.id}
          area={area}
        />
      ))}
    </div>
  );
}