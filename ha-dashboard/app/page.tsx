import { HAStateProvider } from "@/components/HAStateProvider";
import { LightCard } from "@/components/LightCard";
import { getAllStates } from "@/lib/home-assistant/rest";

export default async function Home() {
  const states = await getAllStates();

  return (
    <HAStateProvider initialStates={states}>
      <main className="min-h-screen bg-zinc-50 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-3xl font-semibold text-zinc-900">
            My Home
          </h1>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <LightCard
              entityId="light.living_room_ceiling"
              name="Living Room Ceiling"
            />
          </div>
        </div>
      </main>
    </HAStateProvider>
  );
}