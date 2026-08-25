import { HAStateProvider } from "@/providers/HAStateProvider";
import { LightCard } from "@/components/dashboard/entities/LightCard";
import { SensorCard } from "@/components/dashboard/entities/SensorCard";
import { getAllStates } from "@/lib/home-assistant/rest";
import type { HAState } from "@/lib/home-assistant/types";

import { callHAWebSocket } from "@/lib/home-assistant/websocket";
import type { HAAreaRegistryEntry } from "@/lib/home-assistant/registry/types";
import { getHABootstrap } from "@/lib/home-assistant/bootstrap";
import { buildDashboardModel } from "@/lib/dashboard/model";

interface RoomDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  prefixes: string[];
}

const rooms: RoomDefinition[] = [
  {
    id: "living-room",
    name: "Living Room",
    description: "Main living area",
    icon: "🛋️",
    prefixes: ["living_room"],
  },
  {
    id: "bedroom",
    name: "Bedroom",
    description: "Bedroom and presence",
    icon: "🛏️",
    prefixes: ["bedroom"],
  },
  {
    id: "office",
    name: "Office",
    description: "Workspace",
    icon: "💻",
    prefixes: ["office"],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    description: "Kitchen lighting",
    icon: "🍳",
    prefixes: ["kitchen"],
  },
  {
    id: "entrance",
    name: "Entrance",
    description: "Entrance and porch",
    icon: "🚪",
    prefixes: ["entrance", "porch"],
  },
];

export default async function Home() {
  const states = await getAllStates();

  const lights = filterByDomain(states, "light");

  const sensors = states.filter(
    (entity) =>
      entity.entity_id.startsWith("sensor.") ||
      entity.entity_id.startsWith("binary_sensor."),
  );

  const areas = await callHAWebSocket<HAAreaRegistryEntry[]>({
    type: "config/area_registry/list",
  });

  console.log(areas);

  const bootstrap = await getHABootstrap();
  const model = buildDashboardModel(bootstrap);

  console.log(
    model.areas.map((area) => ({
      name: area.name,
      entities: area.entities.length,
    })),
  );
  const automations = filterByDomain(states, "automation");

  const homeMode = states.find(
    (entity) => entity.entity_id === "input_select.home_mode",
  );

  const lightsOn = lights.filter((entity) => entity.state === "on").length;

  const activeBinarySensors = sensors.filter(
    (entity) =>
      entity.entity_id.startsWith("binary_sensor.") && entity.state === "on",
  ).length;

  return (
    <HAStateProvider initialStates={states}>
      <div className="min-h-screen bg-[#f4f4ef] text-zinc-900">
        <div className="flex min-h-screen">
          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside
            className="
              sticky top-0 hidden h-screen w-64 shrink-0
              border-r border-black/5
              bg-[#fbfaf5]
              px-5 py-7
              lg:flex lg:flex-col
            "
          >
            {/* Brand */}

            <div className="px-2">
              <div
                className="
                  flex h-14 w-14 items-center justify-center
                  rounded-2xl bg-[#234d36]
                  text-2xl text-white
                  shadow-sm
                "
              >
                ⌂
              </div>

              <h1 className="mt-5 text-xl font-semibold tracking-tight">
                My Home
              </h1>

              <p className="mt-1 text-sm text-zinc-400">Home Assistant</p>
            </div>

            {/* Mode */}

            <div
              className="
                mt-8 rounded-2xl
                border border-[#234d36]/10
                bg-[#edf3eb]
                p-4
              "
            >
              <p
                className="
                  text-xs font-medium uppercase tracking-wider
                  text-[#58715e]
                "
              >
                Home Mode
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                <span className="font-semibold text-[#234d36]">
                  {homeMode?.state ?? "Unknown"}
                </span>
              </div>
            </div>

            {/* Navigation */}

            <nav className="mt-8 space-y-1">
              <SidebarLink href="#overview" icon="⌂" label="Overview" active />

              <p
                className="
                  px-4 pb-1 pt-5
                  text-[11px] font-semibold
                  uppercase tracking-[0.14em]
                  text-zinc-400
                "
              >
                Rooms
              </p>

              {rooms.map((room) => (
                <SidebarLink
                  key={room.id}
                  href={`#${room.id}`}
                  icon={room.icon}
                  label={room.name}
                />
              ))}
            </nav>

            {/* Bottom */}

            <div className="mt-auto border-t border-black/5 pt-5">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />

                <div>
                  <p className="text-sm font-medium">System Online</p>

                  <p className="text-xs text-zinc-400">
                    Home Assistant connected
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* ==================================================
              MAIN CONTENT
          ================================================== */}

          <main className="min-w-0 flex-1">
            <div
              className="
                mx-auto max-w-[1500px]
                px-5 py-7
                sm:px-8
                xl:px-10
              "
            >
              {/* ==================================================
                  HEADER
              ================================================== */}

              <section
                id="overview"
                className="
                  relative overflow-hidden
                  rounded-[32px]
                  border border-black/5
                  bg-[#faf9f4]
                  p-7
                  shadow-[0_10px_40px_rgba(0,0,0,0.035)]
                  sm:p-9
                "
              >
                {/* Background decoration */}

                <div
                  className="
                    pointer-events-none absolute
                    -right-24 -top-32
                    h-80 w-80 rounded-full
                    bg-[#dfe9da]/70
                    blur-3xl
                  "
                />

                <div className="relative">
                  <div
                    className="
                      flex flex-col gap-6
                      lg:flex-row
                      lg:items-end
                      lg:justify-between
                    "
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                        <p className="text-sm font-medium text-[#56715d]">
                          All systems operational
                        </p>
                      </div>

                      <h2
                        className="
                          mt-4
                          text-4xl font-semibold
                          tracking-[-0.04em]
                          text-[#18271e]
                          sm:text-5xl
                        "
                      >
                        Welcome Home
                      </h2>

                      <p className="mt-3 max-w-xl text-zinc-500">
                        Monitor and control your Home Assistant devices from one
                        place.
                      </p>
                    </div>

                    <div
                      className="
                        flex items-center gap-3
                        rounded-2xl
                        border border-[#234d36]/10
                        bg-white/70
                        px-5 py-3
                        backdrop-blur
                      "
                    >
                      <div
                        className="
                          flex h-10 w-10
                          items-center justify-center
                          rounded-xl
                          bg-[#e6efe3]
                        "
                      >
                        ⌂
                      </div>

                      <div>
                        <p className="text-xs text-zinc-400">Current Mode</p>

                        <p className="font-semibold text-[#234d36]">
                          {homeMode?.state ?? "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}

                  <div
                    className="
                      mt-9 grid gap-4
                      sm:grid-cols-2
                      xl:grid-cols-4
                    "
                  >
                    <SummaryCard
                      icon="💡"
                      label="Lights On"
                      value={`${lightsOn}`}
                      suffix={`/ ${lights.length}`}
                    />

                    <SummaryCard
                      icon="📡"
                      label="Sensors"
                      value={`${sensors.length}`}
                      suffix="entities"
                    />

                    <SummaryCard
                      icon="⚡"
                      label="Automations"
                      value={`${automations.length}`}
                      suffix="configured"
                    />

                    <SummaryCard
                      icon="●"
                      label="Active Sensors"
                      value={`${activeBinarySensors}`}
                      suffix="active"
                      green
                    />
                  </div>
                </div>
              </section>

              {/* ==================================================
                  ROOM OVERVIEW
              ================================================== */}

              <section className="mt-10">
                <SectionHeader
                  title="Rooms"
                  description="Control devices by room"
                />

                <div
                  className="
                    grid gap-5
                    md:grid-cols-2
                    xl:grid-cols-3
                  "
                >
                  {rooms.map((room) => {
                    const roomLights = getRoomEntities(lights, room);

                    const roomSensors = getRoomEntities(sensors, room);

                    const roomLightsOn = roomLights.filter(
                      (light) => light.state === "on",
                    ).length;

                    return (
                      <a
                        key={room.id}
                        href={`#${room.id}`}
                        className="
                          group relative overflow-hidden
                          rounded-[28px]
                          border border-black/5
                          bg-[#fbfaf6]
                          p-6
                          shadow-[0_6px_25px_rgba(0,0,0,0.035)]
                          transition-all duration-300
                          hover:-translate-y-1
                          hover:shadow-[0_14px_35px_rgba(0,0,0,0.07)]
                        "
                      >
                        <div
                          className="
                            absolute -right-8 -top-8
                            h-28 w-28
                            rounded-full
                            bg-[#e8eee3]
                            opacity-70
                            transition-transform duration-500
                            group-hover:scale-125
                          "
                        />

                        <div className="relative">
                          <div className="flex items-start justify-between">
                            <div
                              className="
                                flex h-12 w-12
                                items-center justify-center
                                rounded-2xl
                                bg-[#edf2e9]
                                text-xl
                              "
                            >
                              {room.icon}
                            </div>

                            <span
                              className="
                                text-xl text-zinc-300
                                transition-transform
                                group-hover:translate-x-1
                              "
                            >
                              →
                            </span>
                          </div>

                          <h3 className="mt-6 text-xl font-semibold">
                            {room.name}
                          </h3>

                          <p className="mt-1 text-sm text-zinc-400">
                            {room.description}
                          </p>

                          <div
                            className="
                              mt-6 flex items-center gap-5
                              border-t border-black/5
                              pt-4
                              text-sm
                            "
                          >
                            <RoomStat
                              label="Lights"
                              value={`${roomLightsOn}/${roomLights.length}`}
                            />

                            <RoomStat
                              label="Sensors"
                              value={`${roomSensors.length}`}
                            />
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>

              {/* ==================================================
                  ROOMS DETAIL
              ================================================== */}

              <div className="mt-12 space-y-12">
                {rooms.map((room) => {
                  const roomLights = getRoomEntities(lights, room);

                  const roomSensors = getRoomEntities(sensors, room);

                  if (roomLights.length === 0 && roomSensors.length === 0) {
                    return null;
                  }

                  return (
                    <section key={room.id} id={room.id} className="scroll-mt-8">
                      <div
                        className="
                          mb-5 flex items-end justify-between
                        "
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="
                              flex h-12 w-12
                              items-center justify-center
                              rounded-2xl
                              bg-[#e7ede2]
                              text-xl
                            "
                          >
                            {room.icon}
                          </div>

                          <div>
                            <h2
                              className="
                                text-2xl font-semibold
                                tracking-tight
                              "
                            >
                              {room.name}
                            </h2>

                            <p className="mt-1 text-sm text-zinc-400">
                              {roomLights.length} lights · {roomSensors.length}{" "}
                              sensors
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Lights */}

                      {roomLights.length > 0 && (
                        <div>
                          <p
                            className="
                              mb-3
                              text-xs font-semibold
                              uppercase tracking-[0.14em]
                              text-zinc-400
                            "
                          >
                            Lighting
                          </p>

                          <div
                            className="
                              grid gap-5
                              sm:grid-cols-2
                              xl:grid-cols-3
                              2xl:grid-cols-4
                            "
                          >
                            {roomLights.map((light) => (
                              <LightCard
                                key={light.entity_id}
                                entityId={light.entity_id}
                                name={getEntityName(light)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sensors */}

                      {roomSensors.length > 0 && (
                        <div className="mt-6">
                          <p
                            className="
                              mb-3
                              text-xs font-semibold
                              uppercase tracking-[0.14em]
                              text-zinc-400
                            "
                          >
                            Sensors
                          </p>

                          <div
                            className="
                              grid gap-5
                              sm:grid-cols-2
                              lg:grid-cols-3
                              xl:grid-cols-4
                            "
                          >
                            {roomSensors.map((sensor) => (
                              <SensorCard
                                key={sensor.entity_id}
                                entityId={sensor.entity_id}
                                name={getEntityName(sensor)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>

              {/* ==================================================
                  OTHER ENTITIES
              ================================================== */}

              <OtherEntities lights={lights} sensors={sensors} />

              <footer
                className="
                  mt-16
                  border-t border-black/5
                  py-8
                  text-center
                  text-xs text-zinc-400
                "
              >
                Home Assistant · Custom Dashboard
              </footer>
            </div>
          </main>
        </div>
      </div>
    </HAStateProvider>
  );
}

/* ================================================================
   UI COMPONENTS
================================================================ */

function SidebarLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`
        flex items-center gap-3
        rounded-xl px-4 py-3
        text-sm font-medium
        transition-all
        ${
          active
            ? "bg-[#234d36] text-white shadow-sm"
            : "text-zinc-500 hover:bg-black/[0.035] hover:text-zinc-900"
        }
      `}
    >
      <span className="w-5 text-center">{icon}</span>

      {label}
    </a>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  suffix,
  green = false,
}: {
  icon: string;
  label: string;
  value: string;
  suffix: string;
  green?: boolean;
}) {
  return (
    <div
      className="
        rounded-2xl
        border border-black/5
        bg-white/75
        p-5
        backdrop-blur
      "
    >
      <div className="flex items-center gap-4">
        <div
          className={`
            flex h-11 w-11
            items-center justify-center
            rounded-xl
            ${green ? "bg-[#e5efe1]" : "bg-[#f2eee2]"}
          `}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs text-zinc-400">{label}</p>

          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span
              className={`
                text-2xl font-semibold
                ${green ? "text-[#386246]" : "text-zinc-900"}
              `}
            >
              {value}
            </span>

            <span className="text-xs text-zinc-400">{suffix}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>

      <p className="mt-1 text-sm text-zinc-400">{description}</p>
    </div>
  );
}

function RoomStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-zinc-400">{label}</span>

      <span className="ml-2 font-semibold text-zinc-800">{value}</span>
    </div>
  );
}

function OtherEntities({
  lights,
  sensors,
}: {
  lights: HAState[];
  sensors: HAState[];
}) {
  const assignedIds = new Set<string>();

  for (const room of rooms) {
    for (const entity of [
      ...getRoomEntities(lights, room),
      ...getRoomEntities(sensors, room),
    ]) {
      assignedIds.add(entity.entity_id);
    }
  }

  const otherLights = lights.filter(
    (entity) => !assignedIds.has(entity.entity_id),
  );

  const otherSensors = sensors.filter(
    (entity) => !assignedIds.has(entity.entity_id),
  );

  if (otherLights.length === 0 && otherSensors.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <SectionHeader
        title="Other Devices"
        description="Entities that are not assigned to a dashboard room"
      />

      {otherLights.length > 0 && (
        <div
          className="
            grid gap-5
            sm:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
          "
        >
          {otherLights.map((light) => (
            <LightCard
              key={light.entity_id}
              entityId={light.entity_id}
              name={getEntityName(light)}
            />
          ))}
        </div>
      )}

      {otherSensors.length > 0 && (
        <div
          className="
            mt-5 grid gap-5
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {otherSensors.map((sensor) => (
            <SensorCard
              key={sensor.entity_id}
              entityId={sensor.entity_id}
              name={getEntityName(sensor)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ================================================================
   ENTITY HELPERS
================================================================ */

function filterByDomain(states: HAState[], domain: string): HAState[] {
  return states.filter((entity) => entity.entity_id.startsWith(`${domain}.`));
}

function getRoomEntities(entities: HAState[], room: RoomDefinition): HAState[] {
  return entities.filter((entity) => {
    const objectId = entity.entity_id.split(".")[1] ?? "";

    return room.prefixes.some(
      (prefix) => objectId === prefix || objectId.startsWith(`${prefix}_`),
    );
  });
}

function getEntityName(entity: {
  entity_id: string;
  attributes: Record<string, unknown>;
}) {
  const friendlyName = entity.attributes.friendly_name;

  if (typeof friendlyName === "string") {
    return friendlyName;
  }

  return entity.entity_id;
}
