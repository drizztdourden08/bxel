/* @layer core @kind types */
import type { MaskView } from '../buffer.type';
import type { Wrap } from '../wrap.type';

type OutlineSide = 'outside' | 'inside';

type OutlineOptions = {
  readonly side: OutlineSide;
  readonly ring: 4 | 8;
  readonly index?: number;
  readonly darker?: Uint8Array;
  readonly mask?: MaskView | null;
  readonly wrap?: Wrap;
};

export type { OutlineOptions };
