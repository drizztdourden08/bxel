/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import type { Size } from '../geometry.type';

const emptyMask = ({ width, height }: Size): MaskView => ({ bits: new Uint8Array(width * height), width, height });

export { emptyMask };
