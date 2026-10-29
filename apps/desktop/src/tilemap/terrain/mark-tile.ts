/* @layer renderer-app @kind logic */
import type { TerrainSet } from '@bxel/document';
import { isTurned } from './is-turned';
import { slotOfMask } from './slot-of-mask';

const markTile = (set: TerrainSet, key: number, mask: number): TerrainSet | null => {
  const slot = slotOfMask(set.kind, mask);
  if (slot < 0) return null;
  const slots = set.slots.map((variants, at) => {
    const kept = variants.filter((variant) => variant.key !== key || isTurned(variant));
    return at === slot ? [...kept, { key, weight: 1 }] : kept;
  });
  return { ...set, slots };
};

export { markTile };
