/* @layer core @kind logic */
import { COLOR_VALUES } from './color-values.constants';
import { countInto } from './count-into';
import { totalsCache } from './totals-cache';

const celTotals = (pixels: Uint8Array): Int32Array => {
  const known = totalsCache.get(pixels);
  if (known) return known;
  const totals = new Int32Array(COLOR_VALUES);
  countInto(pixels, { from: 0, to: pixels.length }, totals, 1);
  totalsCache.set(pixels, totals);
  return totals;
};

export { celTotals };
