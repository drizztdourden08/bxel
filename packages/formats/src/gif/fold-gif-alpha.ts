/* @layer core @kind logic */
import type { GifAnimation } from '../animation/animation.type';
import { clearPaletteIndices } from './clear-palette-indices';
import { GIF_ALPHA } from './gif-alpha.constants';

const foldGifAlpha = (animation: GifAnimation): GifAnimation => {
  const clear = clearPaletteIndices(animation.palette);
  const target = animation.transparentIndex ?? clear[0];
  if (target === undefined) return animation;
  if (clear.every((index) => index === target)) return { ...animation, transparentIndex: target };
  const table = Uint8Array.from({ length: GIF_ALPHA.INDEX_COUNT }, (_unused, index) => index);
  for (const index of clear) table[index] = target;
  return {
    ...animation,
    transparentIndex: target,
    frames: animation.frames.map((frame) => ({ ...frame, indices: frame.indices.map((index) => table[index] ?? index) })),
  };
};

export { foldGifAlpha };
