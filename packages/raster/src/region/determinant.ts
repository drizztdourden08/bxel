/* @layer core @kind logic */
import type { Matrix2 } from './affine.type';

const determinant = (m: Matrix2): number => m[0] * m[3] - m[1] * m[2];

export { determinant };
