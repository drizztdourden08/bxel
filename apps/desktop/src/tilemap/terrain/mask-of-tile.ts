/* @layer renderer-app @kind logic */
import { slotMask } from '@bxel/document';
import type { TerrainSet } from '@bxel/document';
import { isTurned } from './is-turned';

const maskOfTile = (set: TerrainSet, key: number): number | null => {
  const slot = set.slots.findIndex((variants) => variants.some((variant) => variant.key === key && !isTurned(variant)));
  return slot < 0 ? null : slotMask(set.kind, slot);
};

export { maskOfTile };
