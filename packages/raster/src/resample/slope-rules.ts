/* @layer core @kind logic */
import type { Hood, SlopeRule } from './mmpx.type';

const slopeRules = (n: Hood): SlopeRule[] => [
  { slot: 'j', x: n.d, mate: n.b, others: [n.h, n.f], corner: n.a, reach: [n.a, n.c, n.g], tail: n.d, far: [n.p, n.q] },
  { slot: 'k', x: n.b, mate: n.f, others: [n.d, n.h], corner: n.c, reach: [n.a, n.c, n.i], tail: n.b, far: [n.p, n.r] },
  { slot: 'l', x: n.h, mate: n.d, others: [n.f, n.b], corner: n.g, reach: [n.a, n.g, n.i], tail: n.h, far: [n.s, n.q] },
  { slot: 'm', x: n.f, mate: n.h, others: [n.b, n.d], corner: n.i, reach: [n.c, n.g, n.i], tail: n.h, far: [n.r, n.s] },
];

export { slopeRules };
