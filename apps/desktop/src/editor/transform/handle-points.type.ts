/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';
import type { Handle } from './transform.type';

interface HandlePoint {
  handle: Handle;
  at: Point;
}

export type { HandlePoint };
