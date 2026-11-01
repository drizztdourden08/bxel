/* @layer core @kind logic */
import type { FrameId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import type { Sprite } from '../model/sprite.type';
import { blendFrameRgba } from './blend-frame-rgba';
import type { FrameView } from './drawn-layers.type';
import { flattenFrame } from './flatten-frame';
import { RGBA_BYTES } from './frame-to-rgba.constants';
import { packedTable } from './packed-table';

const frameToRgba = (sprite: Sprite, bank: PaletteBank, frameId: FrameId, view?: FrameView): Uint8Array<ArrayBuffer> => {
  if (view) return blendFrameRgba(sprite, bank, frameId, view);
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
