/* @layer renderer-app @kind types */
import type { Point, Size } from '@bxel/raster';

interface SymmetryScope {
  readonly size: Size;
  readonly at: Point | null;
}

export type { SymmetryScope };
