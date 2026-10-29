/* @layer renderer-app @kind logic */
import type { TurnDirection } from '@bxel/document';
import type { Point, Quad } from '@bxel/raster';
import { ANGLE_LIMIT } from './transform.constants';
import { TURN_DEGREES } from './turn-spec.constants';
import type { TransformSpec } from './transform.type';

const around = (corners: Quad, degrees: number): Quad => {
  const xs = corners.map((corner) => corner.x);
  const ys = corners.map((corner) => corner.y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const radians = (degrees * Math.PI) / (ANGLE_LIMIT / 2);
  const turn = (corner: Point): Point => ({
    x: cx + Math.cos(radians) * (corner.x - cx) - Math.sin(radians) * (corner.y - cy),
    y: cy + Math.sin(radians) * (corner.x - cx) + Math.cos(radians) * (corner.y - cy),
  });
  const [a, b, c, d] = corners.map(turn) as [Point, Point, Point, Point];
  return [a, b, c, d];
};

const turnSpec = (spec: TransformSpec, direction: TurnDirection): TransformSpec => {
  const degrees = TURN_DEGREES[direction];
  if (spec.corners) return { ...spec, corners: around(spec.corners, degrees) };
  return { ...spec, angle: (spec.angle + degrees) % (ANGLE_LIMIT + 1) };
};

export { turnSpec };
