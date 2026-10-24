/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';

type SelectVariant = 'rect' | 'ellipse' | 'lasso' | 'polygon' | 'wand' | 'colour';

interface Clip {
  width: number;
  height: number;
  origin: Point;
  pixels: Uint8Array;
  bits: Uint8Array;
}

interface DragShape {
  variant: SelectVariant;
  from: Point;
  to: Point;
  path: readonly Point[];
}

export type { Clip, DragShape, SelectVariant };
