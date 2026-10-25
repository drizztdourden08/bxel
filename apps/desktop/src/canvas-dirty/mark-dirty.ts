/* @layer renderer-app @kind logic */
import { unionRect } from '@bxel/document';
import type { Rect } from '@bxel/raster';
import { dirtyPixels } from './dirty-pixels';

const markDirty = (rgba: Uint8ClampedArray, rect: Rect): void => {
  if (!dirtyPixels.has(rgba)) return;
  const pending = dirtyPixels.get(rgba);
  dirtyPixels.set(rgba, pending ? unionRect(pending, rect) : rect);
};

export { markDirty };
