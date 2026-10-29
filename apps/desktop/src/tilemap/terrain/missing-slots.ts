/* @layer renderer-app @kind logic */
import type { TerrainSet } from '@bxel/document';

const missingSlots = (set: TerrainSet): number[] => set.slots.flatMap((variants, slot) => (variants.length === 0 ? [slot] : []));

export { missingSlots };
