/* @layer core @kind logic */
import type { FilterLanes } from './scanline.type';

const filterUpLane = ({ cur, up, out }: FilterLanes): void => {
  for (let i = 0; i < cur.length; i += 1) {
    out[i] = (cur[i] ?? 0) - (up[i] ?? 0);
  }
};

export { filterUpLane };
