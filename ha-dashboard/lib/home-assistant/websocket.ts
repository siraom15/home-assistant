import { haConfig } from "./config";
import type { HAState } from "./types";

interface HAWebSocketMessage {
  id?: number;
  type: string;

  event?: {
    event_type: string;

    data: {
      entity_id?: string;
      old_state?: HAState | null;
      new_state?: HAState | null;
    };
  };
}
interface HAWebSocketResult<T> {
  id: number;
  type: "result";
  success: boolean;
  result?: T;

  error?: {
    code: string;
    message: string;
  };
}

interface HAAuthMessage {
  type:
    | "auth_required"
    | "auth_ok"
    | "auth_invalid";

  message?: string;
}

interface HAWebSocketCommand {
  type: string;
  [key: string]: unknown;
}

interface HAWebSocketResult<T> {
  id: number;
  type: "result";
  success: boolean;
  result?: T;
  error?: {
    code: string;
    message: string;
  };
}

export function subscribeStateChanges(
  onStateChanged: (state: HAState) => void
) {
  const wsUrl = haConfig.url
    .replace(/^http:/, "ws:")
    .replace(/^https:/, "wss:");

  const socket = new WebSocket(
    `${wsUrl}/api/websocket`
  );

  let authenticated = false;

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(
      event.data
    ) as HAWebSocketMessage;

    if (message.type === "auth_required") {
      socket.send(
        JSON.stringify({
          type: "auth",
          access_token: haConfig.token,
        })
      );

      return;
    }

    if (message.type === "auth_ok") {
      authenticated = true;

      socket.send(
        JSON.stringify({
          id: 1,
          type: "subscribe_events",
          event_type: "state_changed",
        })
      );

      return;
    }

    if (message.type === "auth_invalid") {
      console.error(
        "Home Assistant WebSocket authentication failed"
      );

      socket.close();
      return;
    }

    if (
      authenticated &&
      message.type === "event" &&
      message.event?.event_type === "state_changed"
    ) {
      const newState =
        message.event.data.new_state;

      if (newState) {
        onStateChanged(newState);
      }
    }
  });

  socket.addEventListener("error", (error) => {
    console.error(
      "Home Assistant WebSocket error",
      error
    );
  });

  return () => {
    socket.close();
  };
}

export function callHAWebSocket<T>(
  command: HAWebSocketCommand
): Promise<T> {
  return new Promise((resolve, reject) => {
    const wsBaseUrl = haConfig.url
      .replace(/^http:/, "ws:")
      .replace(/^https:/, "wss:");

    const socket = new WebSocket(
      `${wsBaseUrl}/api/websocket`
    );

    const commandId = 1;

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(
        String(event.data)
      ) as
        | HAAuthMessage
        | HAWebSocketResult<T>;

      if (message.type === "auth_required") {
        socket.send(
          JSON.stringify({
            type: "auth",
            access_token: haConfig.token,
          })
        );

        return;
      }

      if (message.type === "auth_ok") {
        socket.send(
          JSON.stringify({
            id: commandId,
            ...command,
          })
        );

        return;
      }

      if (message.type === "auth_invalid") {
        socket.close();

        reject(
          new Error(
            message.message ??
              "Home Assistant authentication failed"
          )
        );

        return;
      }

      if (
        message.type === "result" &&
        message.id === commandId
      ) {
        socket.close();

        if (!message.success) {
          reject(
            new Error(
              message.error?.message ??
                "Home Assistant WebSocket command failed"
            )
          );

          return;
        }

        resolve(message.result as T);
      }
    });

    socket.addEventListener("error", () => {
      socket.close();

      reject(
        new Error(
          "Home Assistant WebSocket connection failed"
        )
      );
    });
  });
}