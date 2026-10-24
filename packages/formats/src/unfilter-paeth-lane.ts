/* @layer core @kind logic */
import { paethPredictor } from './paeth-predictor';
import type { UnfilterLanes } from './scanline.type';

const unfilterPaethLane = ({ raw, up, out, bpp }: UnfilterLanes): void => {
  const predict = paethPredictor;
  const length = out.length;
  const head = Math.min(bpp, length);
  for (let i = 0; i < head; i += 1) {
    out[i] = (raw[i] ?? 0) + (up[i] ?? 0);
  }
  for (let i = head; i < length; i += 1) {
    out[i] = (raw[i] ?? 0) + predict(out[i - bpp] ?? 0, up[i] ?? 0, up[i - bpp] ?? 0);
  }
};

export { unfilterPaethLane };
