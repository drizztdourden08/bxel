/* @layer renderer-app @kind logic */
import type { Point, Quad } from '@bxel/raster';

const side = (a: Point, b: Point, p: Point): number => (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);

const insideQuad = (quad: Quad, point: Point): boolean => {
  const signs = quad.map((corner, at) => side(corner, quad[(at + 1) % 4] as Point, point));
  return signs.every((sign) => sign >= 0) || signs.every((sign) => sign <= 0);
};

export { insideQuad };
