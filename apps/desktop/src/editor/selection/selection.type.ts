/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';

type SelectVariant = 'rect' | 'ellipse' | 'lasso' | 'polygon' | 'wand' | 'colour';

type SampleSource = 'layer' | 'visible';

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

interface DragKeys {
  shiftAtPress: boolean;
  altAtPress: boolean;
  shiftReleased: boolean;
  altReleased: boolean;
}

interface ShapeHold {
  square: boolean;
  centre: boolean;
}

export type { Clip, DragKeys, DragShape, SampleSource, SelectVariant, ShapeHold };
