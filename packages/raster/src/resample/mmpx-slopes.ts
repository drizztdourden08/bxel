/* @layer core @kind logic */
import type { Hood, Quad } from './mmpx.type';

const anyOf = (value: number, ...others: number[]): boolean => others.some((other) => other === value);

/**
 * MMPX rules for 1:1 slopes. Ported from the MIT licensed JavaScript of McGuire and Gagiu (2021).
 */
const mmpxSlopes = (n: Hood, out: Quad): void => {
  const { a, b, c, d, e, f, g, h, i, p, q, r, s } = n;
  const el = n.luma(e);
  const bl = n.luma(b);
  const dl = n.luma(d);
  const fl = n.luma(f);
  const hl = n.luma(h);
  if (d === b && d !== h && d !== f && (el >= dl || e === a) && anyOf(e, a, c, g) && (el < dl || a !== d || e !== p || e !== q)) out.j = d;
  if (b === f && b !== d && b !== h && (el >= bl || e === c) && anyOf(e, a, c, i) && (el < bl || c !== b || e !== p || e !== r)) out.k = b;
  if (h === d && h !== f && h !== b && (el >= hl || e === g) && anyOf(e, a, g, i) && (el < hl || g !== h || e !== s || e !== q)) out.l = h;
  if (f === h && f !== b && f !== d && (el >= fl || e === i) && anyOf(e, c, g, i) && (el < fl || i !== h || e !== r || e !== s)) out.m = f;
};

export { mmpxSlopes };
