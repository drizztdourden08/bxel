/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import type { Rect } from '../geometry.type';
import { padBuffer } from './pad-buffer';

const padMask = (mask: MaskView, frame: Rect): MaskView => {
  const padded = padBuffer({ pixels: mask.bits, width: mask.width, height: mask.height }, frame);
  return { bits: padded.pixels, width: padded.width, height: padded.height };
};

export { padMask };
