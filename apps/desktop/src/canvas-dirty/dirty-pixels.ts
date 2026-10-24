/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';

const dirtyPixels = new WeakMap<Uint8ClampedArray, Rect | null>();

export { dirtyPixels };
