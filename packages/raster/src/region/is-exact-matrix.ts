/* @layer core @kind logic */
import type { Matrix2 } from './affine.type';
import { EXACT_TOLERANCE } from './is-exact-matrix.constants';

const whole = (value: number): boolean => Math.abs(value - Math.round(value)) < EXACT_TOLERANCE && Math.abs(Math.round(value)) <= 1;

const isExactMatrix = (matrix: Matrix2): boolean => matrix.every(whole);

export { isExactMatrix };
