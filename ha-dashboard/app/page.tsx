import { LightCard } from "@/components/LightCard";
import { getState } from "@/lib/home-assistant/rest";

export default async function Home() {
  const light = await getState(
    "light.living_room_ceiling"
  );

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-zinc-400">
            Home Assistant
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">
            My Home
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Lights and devices
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <LightCard
            entityId={light.entity_id}
            name="Living Room Ceiling"
            initialState={light}
          />
        </div>
      </div>
    </main>
  );
}