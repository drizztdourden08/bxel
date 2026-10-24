/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import { dirtyPixels } from './dirty-pixels';

const takeDirty = (rgba: Uint8ClampedArray): Rect | null | undefined => {
  const pending = dirtyPixels.get(rgba);
  if (pending !== undefined) dirtyPixels.set(rgba, null);
  return pending;
};

export { takeDirty };
