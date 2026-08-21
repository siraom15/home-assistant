import { HAState } from "./types";

export function filterByDomain(
  states: HAState[],
  domain: string
): HAState[] {
  return states.filter((entity) =>
    entity.entity_id.startsWith(`${domain}.`)
  );
}