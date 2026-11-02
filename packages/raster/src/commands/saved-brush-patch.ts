/* @layer core @kind logic */
import { decodeBrushPixels, ERROR_CODE, fail } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import type { BufferView } from '../buffer.type';

const savedBrushPatch = (artwork: Artwork, brushId: string): BufferView => {
  const saved = [...(artwork.brushes ?? []), ...(artwork.patterns ?? [])].find((item) => item.id === brushId);
  if (!saved) {
    throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Brush or pattern ${brushId} does not exist.`, { path: 'options.brushId' });
  }
  return { width: saved.width, height: saved.height, pixels: decodeBrushPixels(saved.pixels) };
};

export { savedBrushPatch };
