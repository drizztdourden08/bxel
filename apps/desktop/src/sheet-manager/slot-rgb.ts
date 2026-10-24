/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { parseHex } from '@bxel/palette';

const slotRgb = (bank: PaletteBank, slot: number): number => {
  const swatch = bank.slots[slot];
  return swatch?.kind === 'color' ? (parseHex(swatch.rgb) ?? 0) : 0;
};

export { slotRgb };
