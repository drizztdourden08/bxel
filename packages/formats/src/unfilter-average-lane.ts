/* @layer core @kind logic */
import type { UnfilterLanes } from './scanline.type';

const unfilterAverageLane = ({ raw, up, out, bpp }: UnfilterLanes): void => {
  const length = out.length;
  const head = Math.min(bpp, length);
  for (let i = 0; i < head; i += 1) {
    out[i] = (raw[i] ?? 0) + ((up[i] ?? 0) >> 1);
  }
  for (let i = head; i < length; i += 1) {
    out[i] = (raw[i] ?? 0) + (((out[i - bpp] ?? 0) + (up[i] ?? 0)) >> 1);
  }
};

export { unfilterAverageLane };
