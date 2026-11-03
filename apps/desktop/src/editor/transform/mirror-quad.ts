/* @layer renderer-app @kind logic */
import type { Point, PointMap, Quad, Rect } from '@bxel/raster';
import { boxCorners } from './box-corners';
import { HALF } from './mirror-quad.constants';

const edgeMap = (map: PointMap) => (point: Point): Point => {
  const to = map({ x: point.x - HALF, y: point.y - HALF });
  return { x: to.x + HALF, y: to.y + HALF };
};

const near = (a: Point, b: Point): boolean => Math.abs(a.x - b.x) < HALF && Math.abs(a.y - b.y) < HALF;

const mirrorQuad = (quad: Quad, box: Rect, mirrored: Rect, map: PointMap): Quad => {
  const across = edgeMap(map);
  const sources = boxCorners(box);
  const arrive = (spot: Point): Point => {
    const found = quad.findIndex((_, at) => near(across(sources[at] ?? spot), spot));
    return across(quad[Math.max(found, 0)] ?? spot);
  };
  const [a, b, c, d] = boxCorners(mirrored);
  return [arrive(a), arrive(b), arrive(c), arrive(d)];
};

export { mirrorQuad };
