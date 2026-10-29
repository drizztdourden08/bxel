/* @layer renderer-app @kind types */
import type { Point, Rect } from '@bxel/raster';
import type { TransformSpec } from './transform.type';

interface SizeRequest {
  local: Point;
  span: Point;
  box: Rect;
  spec: TransformSpec;
}

export type { SizeRequest };
