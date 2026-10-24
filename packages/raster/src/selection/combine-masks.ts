/* @layer core @kind logic */
import { assertSameSize } from '../assert-same-size';
import type { MaskView } from '../buffer.type';
import { emptyMask } from './empty-mask';
import { COMBINE_RULES } from './selection.constants';
import type { CombineMode } from './selection.type';

const combineMasks = (base: MaskView, incoming: MaskView, mode: CombineMode): MaskView => {
  assertSameSize(base, incoming);
  const rule = COMBINE_RULES[mode];
  const result = emptyMask(base);
  for (const [at, value] of base.bits.entries()) {
    result.bits[at] = rule(value, incoming.bits[at] ?? 0);
  }
  return result;
};

export { combineMasks };
