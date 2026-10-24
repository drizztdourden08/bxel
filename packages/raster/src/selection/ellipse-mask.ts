/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import { ellipseFill } from '../ellipse-fill';
import type { Corners, Size } from '../geometry.type';
import { maskFromSpans } from './mask-from-spans';

const ellipseMask = (size: Size, corners: Corners): MaskView => maskFromSpans(size, ellipseFill(corners));

export { ellipseMask };
