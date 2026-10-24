/* @layer tests @kind helper */
import type { PackItem } from '@bxel/formats';

const LCG_MUL = 1664525;
const LCG_ADD = 1013904223;

const makePackItems = (count: number, maxSide: number, seed = 7): PackItem[] => {
  let state = seed;
  const next = (limit: number): number => {
    state = (Math.imul(state, LCG_MUL) + LCG_ADD) >>> 0;
    return 1 + ((state >>> 8) % limit);
  };
  return Array.from({ length: count }, (_, i) => ({
    key: `item${i}`,
    width: next(maxSide),
    height: next(maxSide),
  }));
};

export { makePackItems };
