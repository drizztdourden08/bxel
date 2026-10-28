/* @layer renderer-app @kind logic */
import type { Point, Rect } from '@bxel/raster';
import { SIZE_EPSILON } from './transform.constants';
import type { TransformSpec } from './transform.type';

interface SizeRequest {
  local: Point;
  span: Point;
  box: Rect;
  spec: TransformSpec;
}

const wholeFactor = (wanted: number, extent: number, fallback: number): number => {
  if (extent < 1) return fallback;
  const size = Math.max(1, Math.round(Math.abs(wanted) * extent));
  return (wanted < 0 ? -size : size) / extent;
};

const axisScale = (local: number, span: number, extent: number, fallback: number): number =>
  Math.abs(span) < SIZE_EPSILON ? fallback : wholeFactor(local / span, extent, fallback);

const sizeScale = ({ local, span, box, spec }: SizeRequest): Point => ({
  x: axisScale(local.x, span.x, box.width, spec.scale.x),
  y: axisScale(local.y, span.y, box.height, spec.scale.y),
});

export { sizeScale };
