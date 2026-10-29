/* @layer renderer-app @kind types */
import type { Rect } from '@bxel/raster';

interface MaskPatch {
  rect: Rect;
  pixels: Uint8Array;
}

export type { MaskPatch };
