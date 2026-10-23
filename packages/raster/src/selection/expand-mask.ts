/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import { morphMask } from './morph-mask';

const expandMask = (mask: MaskView, pixels: number): MaskView => morphMask(mask, pixels, 'dilate');

export { expandMask };
