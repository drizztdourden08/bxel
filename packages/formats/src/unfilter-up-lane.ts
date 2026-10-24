/* @layer core @kind logic */
import type { UnfilterLanes } from './scanline.type';

const unfilterUpLane = ({ raw, up, out }: UnfilterLanes): void => {
  for (let i = 0; i < out.length; i += 1) {
    out[i] = (raw[i] ?? 0) + (up[i] ?? 0);
  }
};

export { unfilterUpLane };
