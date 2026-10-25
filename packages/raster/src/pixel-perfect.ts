/* @layer core @kind logic */
import { dropCorner } from './drop-corner';
import type { Point } from './geometry.type';

const pixelPerfect = (points: readonly Point[]): Point[] => {
  const kept: Point[] = [];
  for (const point of points) {
    dropCorner(kept, point);
    kept.push(point);
  }
  return kept;
};

export { pixelPerfect };
