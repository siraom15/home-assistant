import { getDevices } from "@/lib/home-assistant/register/devices";

export async function GET() {
  const devices = await getDevices();

  return Response.json(devices);
}