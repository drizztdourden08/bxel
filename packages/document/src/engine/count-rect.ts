/* @layer core @kind logic */
import type { Rect } from '../model/geometry.type';
import { countInto } from './count-into';

const countRect = ({
  pixels,
  stride,
  rect,
  totals,
  step,
}: {
  pixels: Uint8Array;
  stride: number;
  rect: Rect;
  totals: Int32Array;
  step: number;
}): void => {
  for (let row = 0; row < rect.height; row += 1) {
    const from = (rect.y + row) * stride + rect.x;
    countInto(pixels, { from, to: from + rect.width }, totals, step);
  }
};

export { countRect };
