/* @layer core @kind logic */
import type { BufferView, MaskView } from '../buffer.type';
import { emptyMask } from './empty-mask';

const indexMask = (target: BufferView, index: number): MaskView => {
  const mask = emptyMask(target);
  for (const [at, value] of target.pixels.entries()) {
    if (value === index) {
      mask.bits[at] = 1;
    }
  }
  return mask;
};

export { indexMask };
