/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import { MAX_MORPH_RADIUS } from './selection.constants';
import type { MorphMode, SweepAxis } from './selection.type';
import { slideWindow } from './slide-window';
import { sweepFor } from './sweep-for';

const morphMask = (mask: MaskView, radius: number, mode: MorphMode): MaskView => {
  const reach = Math.min(MAX_MORPH_RADIUS, Math.max(0, Math.trunc(radius)));
  const full = 2 * reach + 1;
  const pass = (bits: Uint8Array, axis: SweepAxis): Uint8Array => {
    const counts = slideWindow(bits, sweepFor(axis, mask), reach);
    return Uint8Array.from(counts, (count) => ((mode === 'erode' ? count === full : count > 0) ? 1 : 0));
  };
  return { bits: pass(pass(mask.bits, 'row'), 'column'), width: mask.width, height: mask.height };
};

export { morphMask };
