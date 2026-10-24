/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';

const channel = (hex: string, from: number): number => Number.parseInt(hex.slice(from, from + 2), 16);

const bankRgba = (bank: PaletteBank): Uint8Array => {
  const table = new Uint8Array(bank.slots.length * 4);
  for (const [index, slot] of bank.slots.entries()) {
    if (slot.kind === 'color') table.set([channel(slot.rgb, 1), channel(slot.rgb, 3), channel(slot.rgb, 5), 255], index * 4);
  }
  return table;
};

export { bankRgba };
