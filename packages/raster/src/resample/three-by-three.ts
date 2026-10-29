/* @layer core @kind logic */
import type { Claim, Three } from './scale3x.type';

const either = (n: Three, first: Claim, second: Claim): boolean =>
  (first[0] && !n.same(n.e, first[1])) || (second[0] && !n.same(n.e, second[1]));

const topRow = (n: Three, db: boolean, bf: boolean): number[] => [
  db ? n.d : n.e,
  either(n, [db, n.c], [bf, n.a]) ? n.b : n.e,
  bf ? n.f : n.e,
];

const middleRow = (n: Three, edges: boolean[]): number[] => {
  const [db = false, bf = false, dh = false, hf = false] = edges;
  return [either(n, [db, n.g], [dh, n.a]) ? n.d : n.e, n.e, either(n, [bf, n.i], [hf, n.c]) ? n.f : n.e];
};

const bottomRow = (n: Three, dh: boolean, hf: boolean): number[] => [
  dh ? n.d : n.e,
  either(n, [dh, n.i], [hf, n.g]) ? n.h : n.e,
  hf ? n.f : n.e,
];

const threeByThree = (n: Three): number[] => {
  const { same } = n;
  const db = same(n.d, n.b) && !same(n.b, n.f) && !same(n.d, n.h);
  const bf = same(n.b, n.f) && !same(n.b, n.d) && !same(n.f, n.h);
  const dh = same(n.d, n.h) && !same(n.d, n.b) && !same(n.h, n.f);
  const hf = same(n.h, n.f) && !same(n.d, n.h) && !same(n.b, n.f);
  return [...topRow(n, db, bf), ...middleRow(n, [db, bf, dh, hf]), ...bottomRow(n, dh, hf)];
};

export { threeByThree };
