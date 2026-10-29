/* @layer core @kind types */
import type { MaskView } from '../buffer.type';
import type { Wrap } from '../wrap.type';

type OutlineSide = 'outside' | 'inside';

type OutlineOptions = {
  readonly side: OutlineSide;
  readonly ring: 4 | 8;
  /** The colour of the outline. Left out when `darker` is set. */
  readonly index?: number;
  /** One step darker along the ramp: the pixel it touches outside, the pixel itself inside. */
  readonly darker?: Uint8Array;
  readonly mask?: MaskView | null;
  readonly wrap?: Wrap;
};

export type { OutlineOptions, OutlineSide };
