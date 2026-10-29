/* @layer renderer-app @kind logic */
import { TERRAIN_SLOTS } from '@bxel/document';
import type { TerrainKind, TerrainSet } from '@bxel/document';
import { KIND_NAMES } from './new-terrain-set.constants';

const newTerrainSet = (kind: TerrainKind, existing: readonly TerrainSet[]): TerrainSet => {
  let count = existing.length + 1;
  while (existing.some((set) => set.id === `terrain_${count}`)) count += 1;
  let name = `${KIND_NAMES[kind]} ${count}`;
  while (existing.some((set) => set.name.toLowerCase() === name.toLowerCase())) name = `${name} b`;
  return { id: `terrain_${count}`, name, kind, slots: Array.from({ length: TERRAIN_SLOTS[kind] }, () => []) };
};

export { newTerrainSet };
