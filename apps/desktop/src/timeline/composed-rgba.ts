/* @layer renderer-app @kind logic */
import { composeAnimationFrame, findBank, paletteRgba, TRANSPARENT_INDEX } from '@bxel/document';
import type { AnimFlip, AnimFrameId, Animation, Artwork } from '@bxel/document';

const composedRgba = (artwork: Artwork, animation: Animation, frameId: AnimFrameId, flip: AnimFlip | null = null): Uint8ClampedArray<ArrayBuffer> | null => {
  const bank = findBank(artwork, animation.bankId);
  if (!bank) return null;
  const indices = composeAnimationFrame(artwork, animation, frameId, flip);
  const table = paletteRgba(bank);
  const data = new Uint8ClampedArray(indices.length * 4);
  for (const [position, index] of indices.entries()) {
    if (index !== TRANSPARENT_INDEX) data.set(table.subarray(index * 4, index * 4 + 4), position * 4);
  }
  return data;
};

export { composedRgba };
