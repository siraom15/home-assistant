import { getHABootstrap } from "@/lib/home-assistant/bootstrap";

export async function GET() {
  const bootstrap = await getHABootstrap();

  return Response.json({
    states: bootstrap.states.length,
    areas: bootstrap.areas.length,
    devices: bootstrap.devices.length,
    entities: bootstrap.entities.length,
  });
}