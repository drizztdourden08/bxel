/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';

const nearestPoint = (points: readonly Point[], at: Point, reach: number): number => {
  let found = -1;
  let best = reach + 1;
  points.forEach((point, index) => {
    const gap = Math.max(Math.abs(point.x - at.x), Math.abs(point.y - at.y));
    if (gap < best) {
      best = gap;
      found = index;
    }
  });
  return found;
};

export { nearestPoint };
