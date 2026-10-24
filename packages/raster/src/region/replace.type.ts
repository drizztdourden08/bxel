/* @layer core @kind types */
import type { BufferView, MaskView } from '../buffer.type';
import type { Rect } from '../geometry.type';

type ReplaceOptions = {
  readonly target: BufferView;
  readonly from: number;
  readonly to: number;
  readonly mask?: MaskView | null;
};

type ReplaceResult = { readonly rect: Rect | null; readonly count: number };

export type { ReplaceOptions, ReplaceResult };
