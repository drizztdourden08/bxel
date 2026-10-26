/* @layer renderer-app @kind logic */
import { animationCells, composeAnimationFrame, findBank, paletteRgba } from '@bxel/document';
import type { Animation, Artwork, TagId } from '@bxel/document';
import { CHANNELS } from './sheet.constants';
import type { FrameImage } from './sheet.type';

const animationCellImages = (artwork: Artwork, animation: Animation, tagId: TagId | null): FrameImage[] => {
  const bank = findBank(artwork, animation.bankId);
  if (!bank) return [];
  const palette = paletteRgba(bank);
  return animationCells(animation, tagId).map((cell) => {
    const indices = composeAnimationFrame(artwork, animation, cell.frameId, cell.flip);
    const rgba = new Uint8ClampedArray(indices.length * CHANNELS);
    indices.forEach((index, at) => rgba.set(palette.subarray(index * CHANNELS, index * CHANNELS + CHANNELS), at * CHANNELS));
    return { width: animation.width, height: animation.height, rgba };
  });
};

export { animationCellImages };
