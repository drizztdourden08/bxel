/* @layer core @kind logic */
import type { PaletteBank } from '../model/palette.type';
import { paletteRgba } from './palette-rgba';

const packedTable = (bank: PaletteBank): Uint32Array => {
  const bytes = paletteRgba(bank);
  const packed = new Uint32Array(bank.slots.length);
  new Uint8Array(packed.buffer).set(bytes);
  return packed;
};

export { packedTable };
