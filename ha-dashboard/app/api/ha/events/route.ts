import { subscribeStateChanges } from "@/lib/home-assistant/websocket";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  let unsubscribe: (() => void) | undefined;

  const stream = new ReadableStream({
    start(controller) {
      unsubscribe = subscribeStateChanges(
        (state) => {
          const data = JSON.stringify(state);

          controller.enqueue(
            encoder.encode(
              `data: ${data}\n\n`
            )
          );
        }
      );

      request.signal.addEventListener(
        "abort",
        () => {
          unsubscribe?.();

          try {
            controller.close();
          } catch {
            // already closed
          }
        }
      );
    },

    cancel() {
      unsubscribe?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}