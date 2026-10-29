/* @layer renderer-app @kind logic */
import { slotMask, TERRAIN_SLOTS } from '@bxel/document';
import type { TerrainKind } from '@bxel/document';

const slotOfMask = (kind: TerrainKind, mask: number): number =>
  Array.from({ length: TERRAIN_SLOTS[kind] }, (_unused, slot) => slot).find((slot) => slotMask(kind, slot) === mask) ?? -1;

export { slotOfMask };
