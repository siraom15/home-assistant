import { getAreas } from "@/lib/home-assistant/register/areas";

export async function GET() {
  const areas = await getAreas();

  return Response.json(areas);
}