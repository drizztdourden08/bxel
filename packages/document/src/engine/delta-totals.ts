/* @layer core @kind logic */
import type { Rect } from '../model/geometry.type';
import { celTotals } from './cel-totals';
import { countRect } from './count-rect';
import { totalsCache } from './totals-cache';

const deltaTotals = ({
  before,
  after,
  stride,
  rect,
}: {
  before: Uint8Array;
  after: Uint8Array;
  stride: number;
  rect: Rect;
}): Int32Array => {
  const totals = Int32Array.from(celTotals(before));
  countRect({ pixels: before, stride, rect, totals, step: -1 });
  countRect({ pixels: after, stride, rect, totals, step: 1 });
  totalsCache.set(after, totals);
  return totals;
};

export { deltaTotals };
