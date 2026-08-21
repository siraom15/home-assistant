import { haConfig } from "./config";

async function request<T>(
  path: string,
  method: "GET" | "POST",
  body?: unknown
): Promise<T> {
  const url = `${haConfig.url}${path}`;

  const response = await fetch(url, {
    method,

    headers: {
      Authorization: `Bearer ${haConfig.token}`,
      ...(body !== undefined && {
        "Content-Type": "application/json",
      }),
    },

    ...(body !== undefined && {
      body: JSON.stringify(body),
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text();

    throw new Error(
      `Home Assistant HTTP ${response.status} ${response.statusText}: ${responseBody}`
    );
  }

  return response.json() as Promise<T>;
}

export function haGet<T>(path: string): Promise<T> {
  return request<T>(path, "GET");
}

export function haPost<T>(
  path: string,
  body?: unknown
): Promise<T> {
  return request<T>(path, "POST", body);
}