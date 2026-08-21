import { filterByDomain, getAllStates, getState } from "@/lib/home-assistant/rest";

export async function GET() {
  try {
    // const state = await getState(
    //   "sensor.living_room_illuminance"
    // );

    const states = await getAllStates();

    const lights = filterByDomain(states, "light");
    const sensors = filterByDomain(states, "sensor");
    const automations = filterByDomain(states, "automation");

    return Response.json({lights, sensors, automations});
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}