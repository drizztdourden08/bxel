/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { parseHex } from '@bxel/palette';
import { BYTE_MASK, CHANNELS, GREEN_SHIFT, OPAQUE, RED_SHIFT } from './bank-table.constants';

const bankTable = (bank: PaletteBank): Uint8ClampedArray<ArrayBuffer> => {
  const table = new Uint8ClampedArray(bank.slots.length * CHANNELS);
  for (const [index, slot] of bank.slots.entries()) {
    if (slot.kind === 'transparent') continue;
    const rgb = parseHex(slot.rgb) ?? 0;
    table.set([(rgb >> RED_SHIFT) & BYTE_MASK, (rgb >> GREEN_SHIFT) & BYTE_MASK, rgb & BYTE_MASK, OPAQUE], index * CHANNELS);
  }
  return table;
};

export { bankTable };
