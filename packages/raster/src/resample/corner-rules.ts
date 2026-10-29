/* @layer core @kind logic */
import { crossingHolds } from './crossing-holds';
import type { CornerRule, Hood } from './mmpx.type';
import { tipHolds } from './tip-holds';

const crossings = (n: Hood): CornerRule[] => [
  { slots: ['k', 'm'], x: n.f, holds: crossingHolds(n.e, { x: n.f, eqE: [n.c, n.i, n.d, n.q], eqX: [n.b, n.h], far: n.at(3, 0) }) },
  { slots: ['j', 'l'], x: n.d, holds: crossingHolds(n.e, { x: n.d, eqE: [n.a, n.g, n.f, n.r], eqX: [n.b, n.h], far: n.at(-3, 0) }) },
  { slots: ['l', 'm'], x: n.h, holds: crossingHolds(n.e, { x: n.h, eqE: [n.g, n.i, n.b, n.p], eqX: [n.d, n.f], far: n.at(0, 3) }) },
  { slots: ['j', 'k'], x: n.b, holds: crossingHolds(n.e, { x: n.b, eqE: [n.a, n.c, n.h, n.s], eqX: [n.d, n.f], far: n.at(0, -3) }) },
];

const tips = (n: Hood): CornerRule[] => [
  { slots: ['j', 'k'], x: n.b, holds: tipHolds(n, { x: n.b, eqE: [n.g, n.h, n.i, n.s], noneE: [n.a, n.d, n.c, n.f] }) },
  { slots: ['l', 'm'], x: n.h, holds: tipHolds(n, { x: n.h, eqE: [n.a, n.b, n.c, n.p], noneE: [n.d, n.g, n.i, n.f] }) },
  { slots: ['k', 'm'], x: n.f, holds: tipHolds(n, { x: n.f, eqE: [n.a, n.d, n.g, n.q], noneE: [n.b, n.c, n.i, n.h] }) },
  { slots: ['j', 'l'], x: n.d, holds: tipHolds(n, { x: n.d, eqE: [n.c, n.f, n.i, n.r], noneE: [n.b, n.a, n.g, n.h] }) },
];

const cornerRules = (n: Hood): CornerRule[] => [...crossings(n), ...tips(n)];

export { cornerRules };
