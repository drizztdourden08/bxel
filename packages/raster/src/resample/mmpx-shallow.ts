/* @layer core @kind logic */
import { allEq, noneEq } from './mmpx-corners';
import type { Hood, Quad } from './mmpx.type';

const aboveSlopes = (n: Hood, out: Quad): void => {
  const { a, b, c, d, e, f, g, h, i, q, r, at } = n;
  if (h === b) return;
  if (h !== a && h !== e && h !== c) {
    if (allEq(h, g, f, r) && noneEq(h, d, at(2, -1))) out.l = out.m;
    if (allEq(h, i, d, q) && noneEq(h, f, at(-2, -1))) out.m = out.l;
  }
  if (b !== i && b !== g && b !== e) {
    if (allEq(b, a, f, r) && noneEq(b, d, at(2, 1))) out.j = out.k;
    if (allEq(b, c, d, q) && noneEq(b, f, at(-2, 1))) out.k = out.j;
  }
};

const sideSlopes = (n: Hood, out: Quad): void => {
  const { a, b, c, d, e, f, g, h, i, p, s, at } = n;
  if (f === d) return;
  if (d !== i && d !== e && d !== c) {
    if (allEq(d, a, h, s) && noneEq(d, b, at(1, 2))) out.j = out.l;
    if (allEq(d, g, b, p) && noneEq(d, h, at(1, -2))) out.l = out.j;
  }
  if (f !== e && f !== a && f !== g) {
    if (allEq(f, c, h, s) && noneEq(f, b, at(-1, 2))) out.k = out.m;
    if (allEq(f, i, b, p) && noneEq(f, h, at(-1, -2))) out.m = out.k;
  }
};

/**
 * MMPX rules for 2:1 and 1:2 slopes. They extend colours that earlier rules chose.
 * Ported from the MIT licensed JavaScript of McGuire and Gagiu (2021).
 */
const mmpxShallow = (n: Hood, out: Quad): void => {
  aboveSlopes(n, out);
  sideSlopes(n, out);
};

export { mmpxShallow };
