/* @layer renderer-app @kind types */
import type { Point, Rect } from '@bxel/raster';
import type { Handle, TransformSpec } from './transform.type';

interface GrabRequest {
  box: Rect;
  spec: TransformSpec;
  point: Point;
  handle: Handle;
}

export type { GrabRequest };
