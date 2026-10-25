/* @layer core @kind logic */
import type { FrameId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import type { Sprite } from '../model/sprite.type';
import { flattenFrame } from './flatten-frame';
import { RGBA_BYTES } from './frame-to-rgba.constants';
import { paletteRgba } from './palette-rgba';

const packedTable = (bank: PaletteBank): Uint32Array => {
  const bytes = paletteRgba(bank);
  const packed = new Uint32Array(bank.slots.length);
  new Uint8Array(packed.buffer).set(bytes);
  return packed;
};

const frameToRgba = (sprite: Sprite, bank: PaletteBank, frameId: FrameId): Uint8Array<ArrayBuffer> => {
  const indices = flattenFrame(sprite, frameId);
  const table = packedTable(bank);
  const out = new Uint8Array(indices.length * RGBA_BYTES);
  const words = new Uint32Array(out.buffer);
  for (let position = 0; position < indices.length; position += 1) {
    words[position] = table[indices[position] ?? 0] ?? 0;
  }
  return out;
};

export { frameToRgba };
