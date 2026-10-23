/* @layer core @kind logic */
import type { PaletteBank } from '../model/palette.type';
import { rgbBytes } from './rgb-bytes';

const paletteRgba = (bank: PaletteBank): Uint8Array => {
  const table = new Uint8Array(bank.slots.length * 4);
  for (const [index, slot] of bank.slots.entries()) {
    if (slot.kind === 'transparent') continue;
    table.set([...rgbBytes(slot.rgb), 255], index * 4);
  }
  return table;
};

export { paletteRgba };
