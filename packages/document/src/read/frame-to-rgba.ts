/* @layer core @kind logic */
import type { FrameId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import type { Sprite } from '../model/sprite.type';
import { flattenFrame } from './flatten-frame';
import { paletteRgba } from './palette-rgba';

const frameToRgba = (sprite: Sprite, bank: PaletteBank, frameId: FrameId): Uint8Array => {
  const indices = flattenFrame(sprite, frameId);
  const table = paletteRgba(bank);
  const out = new Uint8Array(indices.length * 4);
  for (const [position, index] of indices.entries()) {
    out.set(table.subarray(index * 4, index * 4 + 4), position * 4);
  }
  return out;
};

export { frameToRgba };
