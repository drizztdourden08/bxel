/* @layer core @kind config */
import type { CombineMode } from './selection.type';

const COMBINE_RULES: Readonly<Record<CombineMode, (base: number, incoming: number) => number>> = {
  replace: (_base, incoming) => (incoming === 0 ? 0 : 1),
  add: (base, incoming) => (base !== 0 || incoming !== 0 ? 1 : 0),
  subtract: (base, incoming) => (base !== 0 && incoming === 0 ? 1 : 0),
  intersect: (base, incoming) => (base !== 0 && incoming !== 0 ? 1 : 0),
};

const MAX_MORPH_RADIUS = 4096;

export { COMBINE_RULES, MAX_MORPH_RADIUS };
