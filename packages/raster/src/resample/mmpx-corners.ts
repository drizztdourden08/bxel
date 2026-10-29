/* @layer core @kind logic */
import { cornerRules } from './corner-rules';
import type { Hood, Quad } from './mmpx.type';

const mmpxCorners = (n: Hood, out: Quad): void => {
  for (const rule of cornerRules(n)) {
    if (!rule.holds) continue;
    out[rule.slots[0]] = rule.x;
    out[rule.slots[1]] = rule.x;
  }
};

export { mmpxCorners };
