import { getAreas } from "@/lib/home-assistant/registry/areas";

export async function GET() {
  const areas = await getAreas();

  return Response.json(areas);
}