import { haGet, haPost } from "./https";
import type { HAState } from "./types";

export function getState(
  entityId: string
): Promise<HAState> {
  return haGet<HAState>(
    `/api/states/${entityId}`
  );
}

export function getAllStates(): Promise<HAState[]> {
  return haGet<HAState[]>(
    "/api/states"
  );
}

export function callService(
  domain: string,
  service: string,
  data: Record<string, unknown> = {}
): Promise<HAState[]> {
  return haPost<HAState[]>(
    `/api/services/${domain}/${service}`,
    data
  );
}