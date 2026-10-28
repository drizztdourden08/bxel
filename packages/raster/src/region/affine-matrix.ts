/* @layer core @kind logic */
import type { AffineSpec, Matrix2 } from './affine.type';
import { rotationTerms } from './rotation-terms';

const RIGHT = 90;

const tangent = (degrees: number): number => Math.tan((Math.min(Math.max(degrees, -RIGHT + 1), RIGHT - 1) * Math.PI) / 180);

const multiply = (p: Matrix2, q: Matrix2): Matrix2 => [
  p[0] * q[0] + p[1] * q[2],
  p[0] * q[1] + p[1] * q[3],
  p[2] * q[0] + p[3] * q[2],
  p[2] * q[1] + p[3] * q[3],
];

/** The forward matrix: scale first, then skew, then turn. A matrix given outright wins. */
const affineMatrix = (spec: AffineSpec): Matrix2 => {
  if (spec.matrix) return spec.matrix;
  const terms = rotationTerms(spec.angle);
  const turn: Matrix2 = [terms.cos, -terms.sin, terms.sin, terms.cos];
  const skew: Matrix2 = [1, tangent(spec.skew.x), tangent(spec.skew.y), 1];
  const scale: Matrix2 = [spec.scale.x, 0, 0, spec.scale.y];
  return multiply(turn, multiply(skew, scale));
};

const determinant = (m: Matrix2): number => m[0] * m[3] - m[1] * m[2];

export { affineMatrix, determinant };
