/* @layer renderer-app @kind logic */
import type { Point, Quad } from '@bxel/raster';

const mapQuad = (corners: Quad, change: (corner: Point, at: number) => Point): Quad => {
  const [a, b, c, d] = corners;
  return [change(a, 0), change(b, 1), change(c, 2), change(d, 3)];
};

export { mapQuad };
