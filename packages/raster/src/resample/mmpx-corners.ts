/* @layer core @kind logic */
import type { Hood, Quad } from './mmpx.type';

const allEq = (value: number, ...others: number[]): boolean => others.every((other) => other === value);

const noneEq = (value: number, ...others: number[]): boolean => others.every((other) => other !== value);

/**
 * MMPX rules that clean up line intersections and the tips of bright triangles.
 * Ported from the MIT licensed JavaScript of McGuire and Gagiu (2021).
 */
const mmpxCorners = (n: Hood, out: Quad): void => {
  const { a, b, c, d, e, f, g, h, i, p, q, r, s, at } = n;
  const bl = n.luma(b);
  const dl = n.luma(d);
  const fl = n.luma(f);
  const hl = n.luma(h);
  const el = n.luma(e);
  if (e !== f && allEq(e, c, i, d, q) && allEq(f, b, h) && f !== at(3, 0)) {
    out.k = f;
    out.m = f;
  }
  if (e !== d && allEq(e, a, g, f, r) && allEq(d, b, h) && d !== at(-3, 0)) {
    out.j = d;
    out.l = d;
  }
  if (e !== h && allEq(e, g, i, b, p) && allEq(h, d, f) && h !== at(0, 3)) {
    out.l = h;
    out.m = h;
  }
  if (e !== b && allEq(e, a, c, h, s) && allEq(b, d, f) && b !== at(0, -3)) {
    out.j = b;
    out.k = b;
  }
  if (bl < el && allEq(e, g, h, i, s) && noneEq(e, a, d, c, f)) {
    out.j = b;
    out.k = b;
  }
  if (hl < el && allEq(e, a, b, c, p) && noneEq(e, d, g, i, f)) {
    out.l = h;
    out.m = h;
  }
  if (fl < el && allEq(e, a, d, g, q) && noneEq(e, b, c, i, h)) {
    out.k = f;
    out.m = f;
  }
  if (dl < el && allEq(e, c, f, i, r) && noneEq(e, b, a, g, h)) {
    out.j = d;
    out.l = d;
  }
};

export { allEq, mmpxCorners, noneEq };
