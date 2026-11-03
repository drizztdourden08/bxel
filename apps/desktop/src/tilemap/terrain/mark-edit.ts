/* @layer renderer-app @kind logic */
import type { MarkEdit, MarkEditInput } from './mark-edit.type';
import { markTile } from './mark-tile';

const markEdit = ({ set, mask, key, bit, on }: MarkEditInput): MarkEdit => {
  const next = on ? mask | bit : mask & ~bit;
  if (next === mask) return { mask, set: null, changed: false };
  return { mask: next, set: markTile(set, key, next), changed: true };
};

export { markEdit };
