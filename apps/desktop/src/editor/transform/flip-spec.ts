/* @layer renderer-app @kind logic */
import type { FlipAxis } from '@bxel/document';
import type { Point, Quad } from '@bxel/raster';
import type { TransformSpec } from './transform.type';

const mirrored = (corners: Quad, axis: FlipAxis): Quad => {
  const xs = corners.map((corner) => corner.x);
  const ys = corners.map((corner) => corner.y);
  const sumX = Math.min(...xs) + Math.max(...xs);
  const sumY = Math.min(...ys) + Math.max(...ys);
  const flip = (corner: Point): Point => (axis === 'horizontal' ? { x: sumX - corner.x, y: corner.y } : { x: corner.x, y: sumY - corner.y });
  const [a, b, c, d] = corners.map(flip) as [Point, Point, Point, Point];
  return axis === 'horizontal' ? [b, a, d, c] : [d, c, b, a];
};

const flipSpec = (spec: TransformSpec, axis: FlipAxis): TransformSpec => {
  if (spec.corners) return { ...spec, corners: mirrored(spec.corners, axis) };
  const scale = axis === 'horizontal' ? { x: -spec.scale.x, y: spec.scale.y } : { x: spec.scale.x, y: -spec.scale.y };
  return { ...spec, scale, angle: -spec.angle, skew: { x: -spec.skew.x, y: -spec.skew.y } };
};

export { flipSpec };
