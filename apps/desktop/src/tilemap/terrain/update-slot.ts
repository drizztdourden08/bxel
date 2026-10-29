/* @layer renderer-app @kind logic */
import type { TerrainSet, TerrainVariant } from '@bxel/document';

const updateSlot = (set: TerrainSet, slot: number, change: (variants: readonly TerrainVariant[]) => readonly TerrainVariant[]): TerrainSet => ({
  ...set,
  slots: set.slots.map((variants, at) => (at === slot ? change(variants) : variants)),
});

export { updateSlot };
