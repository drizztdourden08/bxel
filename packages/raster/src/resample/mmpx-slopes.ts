/* @layer core @kind logic */
import type { Hood, Quad } from './mmpx.type';
import { slopeHolds } from './slope-holds';
import { slopeRules } from './slope-rules';

const mmpxSlopes = (n: Hood, out: Quad): void => {
  for (const rule of slopeRules(n)) {
    if (slopeHolds(n, rule)) out[rule.slot] = rule.x;
  }
};

export { mmpxSlopes };
