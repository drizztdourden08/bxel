/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import { morphMask } from './morph-mask';

const shrinkMask = (mask: MaskView, pixels: number): MaskView => morphMask(mask, pixels, 'erode');

export { shrinkMask };
