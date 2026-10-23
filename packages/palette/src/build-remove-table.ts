/* @layer core @kind logic */
import { identityTable } from './identity-table';
import { REMAP_SIZE } from './remap-size.constants';
import type { RemoveSpec } from './remap.type';

const isSlot = (value: number, slotCount: number): boolean =>
  Number.isInteger(value) && value >= 0 && value < slotCount;

const buildRemoveTable = ({ slotCount, removed, replacement }: RemoveSpec): Uint8Array => {
  const valid =
    slotCount <= REMAP_SIZE && isSlot(removed, slotCount) && isSlot(replacement, slotCount);
  if (!valid || removed === replacement) {
    throw new Error('INVALID_REPLACEMENT: removed and replacement must be distinct slots');
  }
  const table = identityTable();
  for (let slot = removed + 1; slot < slotCount; slot += 1) table[slot] = slot - 1;
  table[removed] = replacement > removed ? replacement - 1 : replacement;
  return table;
};

export { buildRemoveTable };
