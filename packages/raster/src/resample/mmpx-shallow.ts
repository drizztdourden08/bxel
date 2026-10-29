/* @layer core @kind logic */
import type { Hood, Quad } from './mmpx.type';
import { shallowRules } from './shallow-rules';

const mmpxShallow = (n: Hood, out: Quad): void => {
  for (const rule of shallowRules(n)) {
    if (rule.holds) out[rule.dst] = out[rule.src];
  }
};

export { mmpxShallow };
