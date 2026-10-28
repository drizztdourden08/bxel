/* @layer renderer-app @kind logic */
import type { Point, Rect } from '@bxel/raster';
import { pivotPoint } from './pivot-point';
import type { TransformSpec } from './transform.type';
import { transformMatrix } from './transform-matrix';

const mapPoint = (box: Rect, spec: TransformSpec, point: Point): Point => {
  const m = transformMatrix(spec);
  const c = pivotPoint(box, spec);
  return {
    x: c.x + m[0] * (point.x - c.x) + m[1] * (point.y - c.y) + spec.offset.x,
    y: c.y + m[2] * (point.x - c.x) + m[3] * (point.y - c.y) + spec.offset.y,
  };
};

export { mapPoint };
