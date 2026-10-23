/* @layer core @kind logic */
import type { Point } from './geometry.type';
import { linePoints } from './line-points';

const strokePoints = (points: readonly Point[]): Point[] => {
  const first = points[0];
  if (!first) {
    return [];
  }
  const path: Point[] = [{ x: Math.trunc(first.x), y: Math.trunc(first.y) }];
  let previous = first;
  for (const point of points) {
    path.push(...linePoints({ from: previous, to: point }).slice(1));
    previous = point;
  }
  return path;
};

export { strokePoints };
