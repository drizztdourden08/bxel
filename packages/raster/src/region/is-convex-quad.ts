/* @layer core @kind logic */
import type { Point } from '../geometry.type';

const cross = (a: Point, b: Point, c: Point): number => (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);

/** True when the four points walk round a shape that never turns back on itself. */
const isConvexQuad = (corners: readonly Point[]): boolean => {
  const turns = corners.map((corner, at) => cross(corner, corners[(at + 1) % 4] as Point, corners[(at + 2) % 4] as Point));
  return turns.every((turn) => turn > 0) || turns.every((turn) => turn < 0);
};

export { isConvexQuad };
