/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';

interface CellUnder {
  at: Point;
  key: number | null;
}

export type { CellUnder };
