/* @layer core @kind logic */
import type { PixelBytes } from '../png.type';
import { GIF_ALPHA } from './gif-alpha.constants';

const clearPaletteIndices = (palette: PixelBytes): number[] => {
  const clear: number[] = [];
  for (let at = 0; at < palette.length / GIF_ALPHA.CHANNELS; at += 1) {
    if ((palette[at * GIF_ALPHA.CHANNELS + GIF_ALPHA.ALPHA_AT] ?? 0) < GIF_ALPHA.CUTOFF) clear.push(at);
  }
  return clear;
};

export { clearPaletteIndices };
