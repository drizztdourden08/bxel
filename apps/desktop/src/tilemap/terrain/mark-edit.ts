/* @layer renderer-app @kind logic */
import type { TerrainSet } from '@bxel/document';
import type { MarkEdit } from './mark-edit.type';
import { markTile } from './mark-tile';

const markEdit = (set: TerrainSet, mask: number, key: number, bit: number, on: boolean): MarkEdit => {
  const next = on ? mask | bit : mask & ~bit;
  if (next === mask) return { mask, set: null, changed: false };
  return { mask: next, set: markTile(set, key, next), changed: true };
};

export { markEdit };
