/* @layer core @kind logic */
import { createBounds } from './create-bounds';
import type { PaintTarget, PixelWriter } from './paint.type';

const createWriter = ({ target, index, mask, wrap, ink }: PaintTarget): PixelWriter => ({
  target,
  mask: mask ?? null,
  wrap: wrap ?? {},
  index: index & 255,
  bounds: createBounds(),
  ink: ink ?? null,
  once: ink?.once === true ? new Uint8Array(target.width * target.height) : null,
});

export { createWriter };
