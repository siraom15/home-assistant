"use client";

import { useState } from "react";

type Room = {
  name: string;
  icon: string;
  temperature?: number;
  brightness?: number;
  lights: {
    name: string;
    on: boolean;
  }[];
  motion?: boolean;
};

const scenes = [
  {
    name: "กลับบ้าน",
    icon: "⌂",
    description: "เปิดไฟและเตรียมบ้าน",
  },
  {
    name: "รับแขก",
    icon: "🛋",
    description: "บรรยากาศห้องรับแขก",
  },
  {
    name: "กลางคืน",
    icon: "☾",
    description: "ลดแสงและปิดอุปกรณ์",
  },
  {
    name: "ออกจากบ้าน",
    icon: "▣",
    description: "ปิดระบบที่ไม่จำเป็น",
  },
];

const initialRooms: Room[] = [
  {
    name: "ห้องรับแขก",
    icon: "🛋",
    temperature: 24,
    brightness: 75,
    lights: [
      { name: "ไฟเพดาน", on: true },
      { name: "ไฟโคมตั้งพื้น", on: true },
    ],
  },
  {
    name: "ห้องรับประทานอาหาร",
    icon: "🍴",
    temperature: 24,
    brightness: 60,
    lights: [
      { name: "ไฟโคมเหนือโต๊ะ", on: true },
      { name: "ไฟซ่อนฝ้า", on: false },
    ],
  },
  {
    name: "ครัว",
    icon: "☕",
    temperature: 23,
    brightness: 80,
    lights: [
      { name: "ไฟเพดาน", on: true },
      { name: "ไฟใต้ตู้", on: true },
    ],
  },
  {
    name: "โถงบันได",
    icon: "⌁",
    lights: [
      { name: "ไฟผนัง", on: true },
      { name: "ไฟบันได", on: true },
    ],
    motion: false,
  },
];

export function SmartHomeDashboard() {
  const [rooms, setRooms] = useState(initialRooms);
  const [mode, setMode] = useState("อยู่บ้าน");

  function toggleLight(roomIndex: number, lightIndex: number) {
    setRooms((current) =>
      current.map((room, rIndex) => {
        if (rIndex !== roomIndex) return room;

        return {
          ...room,
          lights: room.lights.map((light, lIndex) =>
            lIndex === lightIndex
              ? {
                  ...light,
                  on: !light.on,
                }
              : light
          ),
        };
      })
    );
  }

  function setBrightness(roomIndex: number, value: number) {
    setRooms((current) =>
      current.map((room, index) =>
        index === roomIndex
          ? {
              ...room,
              brightness: value,
            }
          : room
      )
    );
  }

  const totalLights = rooms.reduce(
    (count, room) => count + room.lights.length,
    0
  );

  const lightsOn = rooms.reduce(
    (count, room) =>
      count + room.lights.filter((light) => light.on).length,
    0
  );

  return (
    <main
      className="
        min-h-screen
        bg-[#eee9df]
        bg-[radial-gradient(circle_at_top,#fffaf2_0%,#eee9df_55%,#ddd8ca_100%)]
        p-4 text-[#342a25]
        md:p-7
      "
    >
      <div className="mx-auto max-w-[1600px]">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="mb-5 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="
                flex h-16 w-16 items-center justify-center
                rounded-2xl border border-[#a87846]/30
                bg-white/60
                text-3xl text-[#a87846]
                shadow-sm backdrop-blur
              "
            >
              ⌂
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                บ้านเขาใหญ่
              </h1>

              <p className="mt-1 text-sm text-[#84766d]">
                ยินดีต้อนรับกลับบ้าน
              </p>
            </div>
          </div>

          {/* HOME MODE */}

          <select
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="
              rounded-full
              border border-[#777d54]/20
              bg-[#737a50]
              px-8 py-3
              text-lg font-medium
              text-white
              shadow-lg shadow-[#72784e]/20
              outline-none
            "
          >
            <option>อยู่บ้าน</option>
            <option>กลางคืน</option>
            <option>ดูหนัง</option>
            <option>ออกจากบ้าน</option>
            <option>นอน</option>
          </select>

          {/* WEATHER / TIME */}

          <div className="flex items-center gap-7">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🌤</span>

              <div>
                <div className="text-3xl">24°C</div>
                <div className="text-xs text-[#887c73]">
                  อากาศดี
                </div>
              </div>
            </div>

            <div className="h-14 w-px bg-[#c9baa8]" />

            <div>
              <div className="text-4xl">08:18</div>
              <div className="text-right text-xs text-[#887c73]">
                เช้าวันนี้
              </div>
            </div>
          </div>
        </header>

        {/* ================================================= */}
        {/* NAVIGATION */}
        {/* ================================================= */}

        <nav
          className="
            mb-7 grid gap-2
            rounded-3xl border border-white/70
            bg-white/60 p-3
            shadow-lg shadow-black/5
            backdrop-blur-xl
            sm:grid-cols-3
            xl:grid-cols-6
          "
        >
          <NavItem icon="⌂" text="หน้าหลัก" active />
          <NavItem icon="▯" text="ชั้น 1" />
          <NavItem icon="⌁" text="ชั้น 2" />
          <NavItem icon="▣" text="โรงรถ - อาคารแยก" />
          <NavItem icon="♨" text="ภายนอก - สระ" />
          <NavItem icon="⚙" text="ระบบบ้าน" />
        </nav>

        {/* ================================================= */}
        {/* TOP DASHBOARD */}
        {/* ================================================= */}

        <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
          {/* SCENES */}

          <section className="dashboard-panel">
            <h2 className="mb-4 text-xl font-semibold">
              ฉาก
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {scenes.map((scene) => (
                <button
                  key={scene.name}
                  className="
                    group
                    flex min-h-56 flex-col
                    items-center justify-between
                    rounded-3xl
                    border border-[#e1d6c8]
                    bg-white/80
                    p-6
                    text-center
                    shadow-sm
                    transition
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >
                  <div
                    className="
                      flex h-20 w-20 items-center justify-center
                      rounded-full
                      bg-[#f6eee3]
                      text-5xl
                      text-[#a36538]
                    "
                  >
                    {scene.icon}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">
                      {scene.name}
                    </h3>

                    <p className="mt-1 text-xs text-[#8e8178]">
                      {scene.description}
                    </p>
                  </div>

                  <div
                    className="
                      flex h-11 w-11 items-center justify-center
                      rounded-full
                      bg-[#c85c30]
                      text-lg text-white
                      transition
                      group-hover:scale-110
                    "
                  >
                    ▶
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* SUMMARY */}

          <section className="dashboard-panel">
            <h2 className="mb-4 text-xl font-semibold">
              ภาพรวมบ้าน
            </h2>

            <div className="space-y-3">
              <SummaryRow
                icon="💡"
                title="ไฟที่เปิดอยู่"
                value={`${lightsOn} / ${totalLights}`}
              />

              <SummaryRow
                icon="❄"
                title="แอร์ที่กำลังทำงาน"
                value="3"
              />

              <SummaryRow
                icon="🔒"
                title="ประตูล็อกแล้ว"
                value="✓"
              />

              <SummaryRow
                icon="●"
                title="Home Assistant"
                value="Online"
              />
            </div>
          </section>
        </div>

        {/* ================================================= */}
        {/* ROOM CARDS */}
        {/* ================================================= */}

        <section className="mt-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {rooms.map((room, roomIndex) => (
              <RoomCard
                key={room.name}
                room={room}
                roomIndex={roomIndex}
                toggleLight={toggleLight}
                setBrightness={setBrightness}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

/* ========================================================= */
/* NAV ITEM */
/* ========================================================= */

function NavItem({
  icon,
  text,
  active = false,
}: {
  icon: string;
  text: string;
  active?: boolean;
}) {
  return (
    <button
      className={`
        flex items-center justify-center gap-3
        rounded-2xl px-4 py-4
        text-sm font-medium
        transition
        ${
          active
            ? "bg-[#c65a31] text-white shadow-lg shadow-[#c65a31]/20"
            : "hover:bg-[#f4eee6]"
        }
      `}
    >
      <span className="text-2xl">{icon}</span>
      {text}
    </button>
  );
}

/* ========================================================= */
/* SUMMARY */
/* ========================================================= */

function SummaryRow({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div
      className="
        flex items-center justify-between
        rounded-2xl
        border border-[#e4d9cb]
        bg-white/80
        p-4
        shadow-sm
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex h-11 w-11 items-center justify-center
            rounded-full
            bg-[#747c50]
            text-white
          "
        >
          {icon}
        </div>

        <span className="font-medium">{title}</span>
      </div>

      <span className="font-semibold text-[#727a4c]">
        {value}
      </span>
    </div>
  );
}

/* ========================================================= */
/* ROOM CARD */
/* ========================================================= */

function RoomCard({
  room,
  roomIndex,
  toggleLight,
  setBrightness,
}: {
  room: Room;
  roomIndex: number;
  toggleLight: (room: number, light: number) => void;
  setBrightness: (room: number, value: number) => void;
}) {
  return (
    <article
      className="
        overflow-hidden
        rounded-3xl
        border border-white/80
        bg-white/75
        shadow-lg shadow-black/5
        backdrop-blur-xl
      "
    >
      {/* HEADER */}

      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-[#9b663e]">
            {room.icon}
          </span>

          <h3 className="text-lg font-semibold">
            {room.name}
          </h3>
        </div>

        <button className="text-xl text-[#736961]">
          ⋮
        </button>
      </div>

      {/* LIGHTS */}

      <div className="px-3">
        {room.lights.map((light, lightIndex) => (
          <div
            key={light.name}
            className="
              flex items-center justify-between
              border-t border-[#ebe3d9]
              px-3 py-4
            "
          >
            <div className="flex items-center gap-3">
              <span>💡</span>
              <span className="text-sm">
                {light.name}
              </span>
            </div>

            <Switch
              value={light.on}
              onClick={() =>
                toggleLight(roomIndex, lightIndex)
              }
            />
          </div>
        ))}
      </div>

      {/* BRIGHTNESS */}

      {room.brightness !== undefined && (
        <div className="border-t border-[#ebe3d9] p-5">
          <div className="mb-3 flex justify-between">
            <span className="text-sm">
              ☀ ความสว่าง
            </span>

            <span className="font-medium">
              {room.brightness}%
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={100}
            value={room.brightness}
            onChange={(event) =>
              setBrightness(
                roomIndex,
                Number(event.target.value)
              )
            }
            className="w-full accent-[#c55c32]"
          />
        </div>
      )}

      {/* MOTION */}

      {room.motion !== undefined && (
        <div
          className="
            flex items-center justify-between
            border-t border-[#ebe3d9]
            p-5
          "
        >
          <span className="text-sm">
            🚶 ตรวจจับการเคลื่อนไหว
          </span>

          <span className="flex items-center gap-2 text-xs text-[#747c50]">
            {room.motion
              ? "พบการเคลื่อนไหว"
              : "ไม่พบการเคลื่อนไหว"}

            <span className="h-2 w-2 rounded-full bg-[#747c50]" />
          </span>
        </div>
      )}

      {/* TEMPERATURE */}

      {room.temperature !== undefined && (
        <div
          className="
            flex items-center justify-between
            border-t border-[#ebe3d9]
            p-5
          "
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🌡</span>

            <span className="text-sm">
              อุณหภูมิ
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="temperature-button">
              −
            </button>

            <span className="min-w-12 text-center text-xl">
              {room.temperature}°
            </span>

            <button className="temperature-button">
              +
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

/* ========================================================= */
/* SWITCH */
/* ========================================================= */

function Switch({
  value,
  onClick,
}: {
  value: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative h-7 w-12
        rounded-full
        transition-colors
        ${
          value
            ? "bg-[#c65a31]"
            : "bg-[#c8c4bd]"
        }
      `}
    >
      <span
        className={`
          absolute top-1
          h-5 w-5
          rounded-full bg-white
          shadow
          transition-all
          ${
            value
              ? "left-6"
              : "left-1"
          }
        `}
      />
    </button>
  );
}