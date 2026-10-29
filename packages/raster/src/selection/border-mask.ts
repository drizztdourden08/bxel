/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import { combineMasks } from './combine-masks';
import { expandMask } from './expand-mask';
import { shrinkMask } from './shrink-mask';

const borderMask = (mask: MaskView, pixels: number): MaskView => combineMasks(expandMask(mask, pixels), shrinkMask(mask, pixels), 'subtract');

export { borderMask };
