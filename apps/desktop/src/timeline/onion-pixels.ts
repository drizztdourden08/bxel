/* @layer renderer-app @kind logic */
import { flattenFrame, TRANSPARENT_INDEX } from '@bxel/document';
import type { FrameId, PaletteBank, Sprite } from '@bxel/document';
import { bankRgba } from '../export/bank-rgba';
import { GREY_WEIGHTS, ONION_TINTS } from './onion.constants';
import type { OnionGhost, Rgb } from './onion.type';

const tinted = (rgba: Uint8Array, at: number, ghost: OnionGhost): Rgb => {
  const own: Rgb = [rgba[at] ?? 0, rgba[at + 1] ?? 0, rgba[at + 2] ?? 0];
  if (ghost.tint === 'split') return ONION_TINTS[ghost.side];
  if (ghost.tint === 'none') return own;
  const grey = Math.round(own[0] * GREY_WEIGHTS[0] + own[1] * GREY_WEIGHTS[1] + own[2] * GREY_WEIGHTS[2]);
  return [grey, grey, grey];
};

const onionPixels = (sprite: Sprite, bank: PaletteBank, shown: FrameId, ghost: OnionGhost): Uint8ClampedArray<ArrayBuffer> => {
  const table = bankRgba(bank);
  const current = flattenFrame(sprite, shown);
  const indices = flattenFrame(sprite, ghost.frameId);
  const out = new Uint8ClampedArray(indices.length * 4);
  for (const [position, index] of indices.entries()) {
    if (index === TRANSPARENT_INDEX || current[position] !== TRANSPARENT_INDEX) continue;
    out.set([...tinted(table, index * 4, ghost), 255], position * 4);
  }
  return out;
};

export { onionPixels };
