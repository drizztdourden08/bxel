/* @layer renderer-app @kind constants */
import { NEIGHBOUR } from '@bxel/document';

const DIRECTIONS: readonly (readonly [number, number, number])[] = [
  [NEIGHBOUR.N, 0, -1],
  [NEIGHBOUR.NE, 1, -1],
  [NEIGHBOUR.E, 1, 0],
  [NEIGHBOUR.SE, 1, 1],
  [NEIGHBOUR.S, 0, 1],
  [NEIGHBOUR.SW, -1, 1],
  [NEIGHBOUR.W, -1, 0],
  [NEIGHBOUR.NW, -1, -1],
];

export { DIRECTIONS };
