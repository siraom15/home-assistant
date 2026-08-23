import { getEntities } from "@/lib/home-assistant/registry/entities";

export async function GET() {
	const entities = await getEntities();

	return Response.json(entities);
}