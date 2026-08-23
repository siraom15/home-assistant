import { getEntities } from "@/lib/home-assistant/register/entities";

export async function GET() {
	const entities = await getEntities();

	return Response.json(entities);
}