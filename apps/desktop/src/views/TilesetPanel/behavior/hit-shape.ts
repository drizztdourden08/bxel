/* @layer renderer-app @kind logic */
import type { Point, TileShape } from '@bxel/document';
import { outlinePoints } from '../../../tilemap/collision/outline-points';

const inside = (points: readonly Point[], at: Point): boolean => {
  let hit = false;
  points.forEach((point, index) => {
    const other = points[(index + points.length - 1) % points.length] ?? point;
    const crosses = point.y > at.y !== other.y > at.y && at.x < ((other.x - point.x) * (at.y - point.y)) / (other.y - point.y) + point.x;
    if (crosses) hit = !hit;
  });
  return hit;
};

const hitShape = (shapes: readonly TileShape[], at: Point, size: { width: number; height: number }): number =>
  shapes.map((shape) => inside(outlinePoints(shape, size), at)).lastIndexOf(true);

export { hitShape };
