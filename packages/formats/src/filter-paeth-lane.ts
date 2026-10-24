/* @layer core @kind logic */
import { paethPredictor } from './paeth-predictor';
import type { FilterLanes } from './scanline.type';

const filterPaethLane = ({ cur, up, out, bpp }: FilterLanes): void => {
  const predict = paethPredictor;
  const length = cur.length;
  const head = Math.min(bpp, length);
  for (let i = 0; i < head; i += 1) {
    out[i] = (cur[i] ?? 0) - (up[i] ?? 0);
  }
  for (let i = head; i < length; i += 1) {
    out[i] = (cur[i] ?? 0) - predict(cur[i - bpp] ?? 0, up[i] ?? 0, up[i - bpp] ?? 0);
  }
};

export { filterPaethLane };
