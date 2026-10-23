/* @layer core @kind logic */
import type { Point } from './geometry.type';

const isLCorner = (a: Point, b: Point, c: Point): boolean => {
  const diagonal = Math.abs(c.x - a.x) === 1 && Math.abs(c.y - a.y) === 1;
  const viaA = b.x === a.x && b.y === c.y;
  const viaC = b.x === c.x && b.y === a.y;
  return diagonal && (viaA || viaC);
};

const dropCorner = (kept: Point[], next: Point): void => {
  const a = kept[kept.length - 2];
  const b = kept[kept.length - 1];
  if (a && b && isLCorner(a, b, next)) {
    kept.pop();
  }
};

const pixelPerfect = (points: readonly Point[]): Point[] => {
  const kept: Point[] = [];
  for (const point of points) {
    dropCorner(kept, point);
    kept.push(point);
  }
  return kept;
};

export { pixelPerfect };
