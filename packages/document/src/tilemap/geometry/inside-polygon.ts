/* @layer core @kind logic */
import type { Point } from '../../model/geometry.type';

const insidePolygon = (polygon: readonly Point[], x: number, y: number): boolean => {
  let sign = 0;
  for (let at = 0; at < polygon.length; at += 1) {
    const from = polygon[at];
    const to = polygon[(at + 1) % polygon.length];
    if (!from || !to) return false;
    const cross = (to.x - from.x) * (y - from.y) - (to.y - from.y) * (x - from.x);
    if (cross !== 0) {
      if (sign !== 0 && Math.sign(cross) !== sign) return false;
      sign = Math.sign(cross);
    }
  }
  return true;
};

export { insidePolygon };
