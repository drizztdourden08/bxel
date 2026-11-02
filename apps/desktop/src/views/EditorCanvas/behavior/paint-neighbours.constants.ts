/* @layer renderer-app @kind constants */
import type { Point } from '@bxel/document';

const NEIGHBOUR_VEIL = 0.4;

const NEIGHBOUR_OFFSETS: readonly Point[] = [-1, 0, 1].flatMap((y) => [-1, 0, 1].filter((x) => x !== 0 || y !== 0).map((x) => ({ x, y })));

export { NEIGHBOUR_OFFSETS, NEIGHBOUR_VEIL };
