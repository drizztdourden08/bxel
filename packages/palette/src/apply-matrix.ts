/* @layer core @kind logic */
import type { Triple } from './oklab.type';

const dot = (row: Triple | undefined, vector: Triple): number => (row ? row[0] * vector[0] + row[1] * vector[1] + row[2] * vector[2] : 0);

const applyMatrix = (matrix: readonly Triple[], vector: Triple): Triple => [dot(matrix[0], vector), dot(matrix[1], vector), dot(matrix[2], vector)];

export { applyMatrix };
