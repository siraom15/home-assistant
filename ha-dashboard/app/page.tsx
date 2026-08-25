import { HAStateProvider } from "@/providers/HAStateProvider";

import { AreaGrid } from "@/components/dashboard/areas/AreaGrid";
import { EntityRenderer } from "@/components/dashboard/entities/EntityRenderer";

import { getHABootstrap } from "@/lib/home-assistant/bootstrap";
import { buildDashboardModel } from "@/lib/dashboard/model";

export default async function Home() {
  const bootstrap = await getHABootstrap();
  const model = buildDashboardModel(bootstrap);

  return (
    <HAStateProvider initialStates={bootstrap.states}>
      <main className="min-h-screen bg-[#f4f4ef] text-zinc-900">
        <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 xl:px-10">
          {/* =========================================
              PAGE HEADER
          ========================================= */}

          <header className="mb-10">
            <p className="text-sm font-medium text-zinc-400">
              Home Assistant
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              My Home
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              {model.areas.length} areas
            </p>
          </header>

          {/* =========================================
              AREAS
          ========================================= */}

          <AreaGrid areas={model.areas} />

          {/* =========================================
              UNASSIGNED ENTITIES
          ========================================= */}

          {model.unassigned.length > 0 && (
            <section className="mt-14">
              <div className="mb-5">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Unassigned
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Entities that are not assigned to a Home Assistant area.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {model.unassigned.map((entity) => (
                  <EntityRenderer
                    key={entity.entityId}
                    entity={entity}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </HAStateProvider>
  );
}