/* @layer core @kind logic */
import type { FilterLanes } from './scanline.type';

const filterAverageLane = ({ cur, up, out, bpp }: FilterLanes): void => {
  const length = cur.length;
  const head = Math.min(bpp, length);
  for (let i = 0; i < head; i += 1) {
    out[i] = (cur[i] ?? 0) - ((up[i] ?? 0) >> 1);
  }
  for (let i = head; i < length; i += 1) {
    out[i] = (cur[i] ?? 0) - (((cur[i - bpp] ?? 0) + (up[i] ?? 0)) >> 1);
  }
};

export { filterAverageLane };
