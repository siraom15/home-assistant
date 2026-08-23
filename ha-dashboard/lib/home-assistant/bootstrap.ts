import { getAllStates } from "./rest";
import { getAreas } from "./registry/areas";
import { getDevices } from "./registry/devices";
import { getEntities } from "./registry/entities";

import type { HABootstrap } from "./types";

export async function getHABootstrap(): Promise<HABootstrap> {
  const [
    states,
    areas,
    devices,
    entities,
  ] = await Promise.all([
    getAllStates(),
    getAreas(),
    getDevices(),
    getEntities(),
  ]);

  return {
    states,
    areas,
    devices,
    entities,
  };
}