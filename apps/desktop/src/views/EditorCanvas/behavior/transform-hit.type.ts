/* @layer renderer-app @kind types */
import type { Point, Rect } from '@bxel/raster';
import type { Handle, TransformSpec } from '../../../editor/transform/transform.type';

interface TransformHit {
  box: Rect;
  spec: TransformSpec;
  point: Point;
  handle: Handle | null;
}

export type { TransformHit };
