/* @layer core @kind logic */
import type { Matrix2 } from './affine.type';

const TOLERANCE = 1e-9;

const whole = (value: number): boolean => Math.abs(value - Math.round(value)) < TOLERANCE && Math.abs(Math.round(value)) <= 1;

/** True for flips and right angle turns: every term is 0, 1 or -1, so a plain lookup loses nothing. */
const isExactMatrix = (matrix: Matrix2): boolean => matrix.every(whole);

export { isExactMatrix };
