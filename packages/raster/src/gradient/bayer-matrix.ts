/* @layer core @kind logic */
import { BAYER_BASE_SIZE, BAYER_QUADRANT_ADDS } from './gradient.constants';
import type { BayerSize } from './gradient.type';

const doubled = (matrix: Uint8Array, side: number): Uint8Array => {
  const next = side * 2;
  const grown = new Uint8Array(next * next);
  for (let y = 0; y < next; y++) {
    for (let x = 0; x < next; x++) {
      const quadrant = Math.floor(y / side) * 2 + Math.floor(x / side);
      grown[y * next + x] = 4 * (matrix[(y % side) * side + (x % side)] ?? 0) + (BAYER_QUADRANT_ADDS[quadrant] ?? 0);
    }
  }
  return grown;
};

const bayerMatrix = (size: BayerSize): Uint8Array => {
  let matrix: Uint8Array = Uint8Array.from(BAYER_QUADRANT_ADDS);
  for (let side = BAYER_BASE_SIZE; side < size; side *= 2) {
    matrix = doubled(matrix, side);
  }
  return matrix;
};

export { bayerMatrix };
