/* @layer core @kind logic */
import type { Corners, Point } from './geometry.type';
import { normalizeCorners } from './normalize-corners';

const rectOutline = (corners: Corners): Point[] => {
  const { x0, y0, x1, y1 } = normalizeCorners(corners);
  const points: Point[] = [];
  for (let x = x0; x <= x1; x++) {
    points.push({ x, y: y0 });
    if (y1 > y0) {
      points.push({ x, y: y1 });
    }
  }
  for (let y = y0 + 1; y < y1; y++) {
    points.push({ x: x0, y });
    if (x1 > x0) {
      points.push({ x: x1, y });
    }
  }
  return points;
};

export { rectOutline };
