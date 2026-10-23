/* @layer core @kind logic */
import { createBounds } from './create-bounds';
import type { PaintTarget, PixelWriter } from './paint.type';

const createWriter = ({ target, index, mask }: PaintTarget): PixelWriter => ({
  target,
  mask: mask ?? null,
  index: index & 255,
  bounds: createBounds(),
});

export { createWriter };
