/* @layer core @kind logic */
import type { Hood, ShallowRule } from './mmpx.type';
import { shallowGuard } from './shallow-guard';
import { shallowHolds } from './shallow-holds';

const above = (n: Hood): ShallowRule[] => {
  const open = n.h !== n.b;
  const low = shallowGuard(open, n.h, [n.a, n.e, n.c]);
  const high = shallowGuard(open, n.b, [n.i, n.g, n.e]);
  return [
    { holds: shallowHolds({ guard: low, x: n.h, eq: [n.g, n.f, n.r], none: [n.d, n.at(2, -1)] }), dst: 'l', src: 'm' },
    { holds: shallowHolds({ guard: low, x: n.h, eq: [n.i, n.d, n.q], none: [n.f, n.at(-2, -1)] }), dst: 'm', src: 'l' },
    { holds: shallowHolds({ guard: high, x: n.b, eq: [n.a, n.f, n.r], none: [n.d, n.at(2, 1)] }), dst: 'j', src: 'k' },
    { holds: shallowHolds({ guard: high, x: n.b, eq: [n.c, n.d, n.q], none: [n.f, n.at(-2, 1)] }), dst: 'k', src: 'j' },
  ];
};

const beside = (n: Hood): ShallowRule[] => {
  const open = n.f !== n.d;
  const left = shallowGuard(open, n.d, [n.i, n.e, n.c]);
  const right = shallowGuard(open, n.f, [n.e, n.a, n.g]);
  return [
    { holds: shallowHolds({ guard: left, x: n.d, eq: [n.a, n.h, n.s], none: [n.b, n.at(1, 2)] }), dst: 'j', src: 'l' },
    { holds: shallowHolds({ guard: left, x: n.d, eq: [n.g, n.b, n.p], none: [n.h, n.at(1, -2)] }), dst: 'l', src: 'j' },
    { holds: shallowHolds({ guard: right, x: n.f, eq: [n.c, n.h, n.s], none: [n.b, n.at(-1, 2)] }), dst: 'k', src: 'm' },
    { holds: shallowHolds({ guard: right, x: n.f, eq: [n.i, n.b, n.p], none: [n.h, n.at(-1, -2)] }), dst: 'm', src: 'k' },
  ];
};

const shallowRules = (n: Hood): ShallowRule[] => [...above(n), ...beside(n)];

export { shallowRules };
