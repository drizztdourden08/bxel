/* @layer core @kind logic */
import { mirrorCoord } from './mirror-coord';
import type { Point } from './geometry.type';
import type { MirrorOptions } from './symmetry.type';

const mirrorPoints = ({ points, symmetry, span = 1 }: MirrorOptions): Point[][] => {
  const axisX = symmetry.x2 ?? null;
  const axisY = symmetry.y2 ?? null;
  const variants: Point[][] = [[...points]];
  if (axisX !== null) {
    variants.push(points.map((p) => ({ x: mirrorCoord(p.x, axisX, span), y: p.y })));
  }
  if (axisY !== null) {
    variants.push(points.map((p) => ({ x: p.x, y: mirrorCoord(p.y, axisY, span) })));
  }
  if (axisX !== null && axisY !== null) {
    variants.push(points.map((p) => ({ x: mirrorCoord(p.x, axisX, span), y: mirrorCoord(p.y, axisY, span) })));
  }
  return variants;
};

export { mirrorPoints };
