/* @layer renderer-app @kind logic */
import type { Point, Quad } from '@bxel/raster';

const edgeMiddle = (corners: Quad, index: number): Point => {
  const a = corners[index % 4] as Point;
  const b = corners[(index + 1) % 4] as Point;
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
};

export { edgeMiddle };
