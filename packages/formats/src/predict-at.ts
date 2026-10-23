/* @layer core @kind logic */
import { predictByte } from './predict-byte';
import type { RowView } from './scanline.type';

const predictAt = (type: number, view: RowView, i: number): number => {
  const hasLeft = i >= view.bpp;
  const hasUp = view.prevStart >= 0;
  const a = hasLeft ? (view.buf[view.start + i - view.bpp] ?? 0) : 0;
  const b = hasUp ? (view.buf[view.prevStart + i] ?? 0) : 0;
  const c = hasLeft && hasUp ? (view.buf[view.prevStart + i - view.bpp] ?? 0) : 0;
  return predictByte(type, a, b, c);
};

export { predictAt };
