/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import type { Corners, Size } from '../geometry.type';
import { rectFill } from '../rect-fill';
import { maskFromSpans } from './mask-from-spans';

const rectMask = (size: Size, corners: Corners): MaskView => maskFromSpans(size, rectFill(corners));

export { rectMask };
