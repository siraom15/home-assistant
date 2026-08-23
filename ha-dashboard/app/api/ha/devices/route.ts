import { getDevices } from "@/lib/home-assistant/registry/devices";

export async function GET() {
  const devices = await getDevices();

  return Response.json(devices);
}