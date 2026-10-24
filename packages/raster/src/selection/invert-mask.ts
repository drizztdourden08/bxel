/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import { emptyMask } from './empty-mask';

const invertMask = (mask: MaskView): MaskView => {
  const result = emptyMask(mask);
  for (const [at, value] of mask.bits.entries()) {
    result.bits[at] = value === 0 ? 1 : 0;
  }
  return result;
};

export { invertMask };
