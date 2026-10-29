/* @layer core @kind config */
import type { CombineMode } from './selection.type';

const COMBINE_RULES: Readonly<Record<CombineMode, (base: number, incoming: number) => number>> = {
  replace: (_base, incoming) => (incoming === 0 ? 0 : 1),
  add: (base, incoming) => (base !== 0 || incoming !== 0 ? 1 : 0),
  subtract: (base, incoming) => (base !== 0 && incoming === 0 ? 1 : 0),
  intersect: (base, incoming) => (base !== 0 && incoming !== 0 ? 1 : 0),
};

const MAX_MORPH_RADIUS = 4096;

const CROSS_STEPS: readonly (readonly [number, number])[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const SQUARE_STEPS: readonly (readonly [number, number])[] = [...CROSS_STEPS, [1, 1], [1, -1], [-1, 1], [-1, -1]];

const SMOOTH_KEEP = 2;

const SMOOTH_FILL = 3;

export { COMBINE_RULES, CROSS_STEPS, MAX_MORPH_RADIUS, SMOOTH_FILL, SMOOTH_KEEP, SQUARE_STEPS };
