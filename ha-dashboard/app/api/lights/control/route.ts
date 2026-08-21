import { callService } from "@/lib/home-assistant/rest";

interface LightControlBody {
  entityId: string;
  action: "turn_on" | "turn_off";
  brightnessPct?: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LightControlBody;

    const {
      entityId,
      action,
      brightnessPct,
    } = body;

    if (!entityId) {
      return Response.json(
        {
          error: "entityId is required",
        },
        {
          status: 400,
        }
      );
    }

    const serviceData: Record<string, unknown> = {
      entity_id: entityId,
    };

    if (
      action === "turn_on" &&
      brightnessPct !== undefined
    ) {
      serviceData.brightness_pct = brightnessPct;
    }

    const result = await callService(
      "light",
      action,
      serviceData
    );

    return Response.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
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