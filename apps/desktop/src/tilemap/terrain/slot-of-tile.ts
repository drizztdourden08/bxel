/* @layer renderer-app @kind logic */
import type { TerrainSet } from '@bxel/document';

const slotOfTile = (set: TerrainSet | undefined, key: number): number | null => {
  const slot = set ? set.slots.findIndex((variants) => variants.some((variant) => variant.key === key)) : -1;
  return slot < 0 ? null : slot;
};

export { slotOfTile };
