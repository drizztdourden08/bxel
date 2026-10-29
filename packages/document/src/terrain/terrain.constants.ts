/* @layer core @kind config */
import type { TerrainKind } from '../model/tilemap.type';

const TERRAIN_KINDS = ['blob16', 'blob47', 'corner16'] as const;

const TERRAIN_SLOTS: Readonly<Record<TerrainKind, number>> = { blob16: 16, blob47: 47, corner16: 16 };

const NEIGHBOUR = { N: 1, NE: 2, E: 4, SE: 8, S: 16, SW: 32, W: 64, NW: 128 } as const;

const NEIGHBOUR_STEPS: readonly (readonly [number, number, number])[] = [
  [NEIGHBOUR.N, 0, -1],
  [NEIGHBOUR.NE, 1, -1],
  [NEIGHBOUR.E, 1, 0],
  [NEIGHBOUR.SE, 1, 1],
  [NEIGHBOUR.S, 0, 1],
  [NEIGHBOUR.SW, -1, 1],
  [NEIGHBOUR.W, -1, 0],
  [NEIGHBOUR.NW, -1, -1],
];

const BLOB47_MASKS: readonly number[] = [
  0, 1, 4, 5, 7, 16, 17, 20, 21, 23, 28, 29, 31, 64, 65, 68, 69, 71, 80, 81, 84, 85, 87, 92, 93, 95, 112, 113, 116, 117, 119, 124, 125, 127, 193,
  197, 199, 209, 213, 215, 221, 223, 241, 245, 247, 253, 255,
];

const CORNER_BITS: readonly number[] = [NEIGHBOUR.NE, NEIGHBOUR.SE, NEIGHBOUR.SW, NEIGHBOUR.NW];

const CORNER_EDGES: readonly number[] = [
  NEIGHBOUR.N | NEIGHBOUR.E,
  NEIGHBOUR.E | NEIGHBOUR.S,
  NEIGHBOUR.S | NEIGHBOUR.W,
  NEIGHBOUR.W | NEIGHBOUR.N,
];

const BLOB16_EDGES = NEIGHBOUR.N | NEIGHBOUR.E | NEIGHBOUR.S | NEIGHBOUR.W;

export { BLOB16_EDGES, BLOB47_MASKS, CORNER_BITS, CORNER_EDGES, NEIGHBOUR, NEIGHBOUR_STEPS, TERRAIN_KINDS, TERRAIN_SLOTS };
