/* @layer core @kind logic */
import { decodeBrushPixels, ERROR_CODE, fail } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import type { BufferView } from '../buffer.type';

const savedBrushPatch = (artwork: Artwork, brushId: string): BufferView => {
  const brush = (artwork.brushes ?? []).find((item) => item.id === brushId);
  if (!brush) {
    throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Brush ${brushId} does not exist.`, { path: 'options.brushId' });
  }
  return { width: brush.width, height: brush.height, pixels: decodeBrushPixels(brush.pixels) };
};

export { savedBrushPatch };
