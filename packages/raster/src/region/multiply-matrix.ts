/* @layer core @kind logic */
import type { Matrix2 } from './affine.type';

const multiplyMatrix = (p: Matrix2, q: Matrix2): Matrix2 => [
  p[0] * q[0] + p[1] * q[2],
  p[0] * q[1] + p[1] * q[3],
  p[2] * q[0] + p[3] * q[2],
  p[2] * q[1] + p[3] * q[3],
];

export { multiplyMatrix };
