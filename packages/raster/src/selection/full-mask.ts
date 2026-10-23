/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import type { Size } from '../geometry.type';
import { emptyMask } from './empty-mask';

const fullMask = (size: Size): MaskView => {
  const mask = emptyMask(size);
  mask.bits.fill(1);
  return mask;
};

export { fullMask };
