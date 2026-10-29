/* @layer core @kind logic */
import type { Rect } from '../geometry.type';
import type { Quad } from './affine.type';
import { EPSILON, FAR } from './homography.constants';
import type { Inverse } from './homography.type';

const squareToQuad = (quad: Quad): readonly number[] => {
  const [p0, p1, p2, p3] = quad;
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const dy3 = p0.y - p1.y + p2.y - p3.y;
  if (Math.abs(dx3) < EPSILON && Math.abs(dy3) < EPSILON) {
    return [p1.x - p0.x, p2.x - p1.x, p0.x, p1.y - p0.y, p2.y - p1.y, p0.y, 0, 0];
  }
  const det = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / det;
  const h = (dx1 * dy3 - dx3 * dy1) / det;
  return [p1.x - p0.x + g * p1.x, p3.x - p0.x + h * p3.x, p0.x, p1.y - p0.y + g * p1.y, p3.y - p0.y + h * p3.y, p0.y, g, h];
};

const quadInverse = (quad: Quad, box: Rect): Inverse => {
  const [a, b, c, d, e, f, g, h] = squareToQuad(quad) as [number, number, number, number, number, number, number, number];
  const m = [
    [e - f * h, c * h - b, b * f - c * e],
    [f * g - d, a - c * g, c * d - a * f],
    [d * h - e * g, b * g - a * h, a * e - b * d],
  ] as const;
  return (x, y) => {
    const w = (m[2][0] * x + m[2][1] * y + m[2][2]);
    if (Math.abs(w) < EPSILON) return { x: FAR, y: FAR };
    return { x: box.x + ((m[0][0] * x + m[0][1] * y + m[0][2]) / w) * box.width, y: box.y + ((m[1][0] * x + m[1][1] * y + m[1][2]) / w) * box.height };
  };
};

export { quadInverse };
