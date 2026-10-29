/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import { emptyMask } from './empty-mask';
import { isOn } from './count-on';
import { CROSS_STEPS, SMOOTH_FILL, SMOOTH_KEEP } from './selection.constants';

const around = (mask: MaskView, x: number, y: number): number => CROSS_STEPS.filter(([dx, dy]) => isOn(mask, x + dx, y + dy)).length;

const keeps = (mask: MaskView, x: number, y: number): boolean => (isOn(mask, x, y) ? around(mask, x, y) >= SMOOTH_KEEP : around(mask, x, y) >= SMOOTH_FILL);

const smoothMask = (mask: MaskView): MaskView => {
  const out = emptyMask(mask);
  for (let y = 0; y < mask.height; y++) {
    for (let x = 0; x < mask.width; x++) {
      if (keeps(mask, x, y)) out.bits[y * mask.width + x] = 1;
    }
  }
  return out;
};

export { smoothMask };
