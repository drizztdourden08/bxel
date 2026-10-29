/* @layer core @kind types */
import type { BufferView, MaskView } from './buffer.type';
import type { Connectivity, FillMode } from './fill.type';
import type { Point } from './geometry.type';
import type { InkRule } from './ink/ink.type';
import type { Wrap } from './wrap.type';

type RegionFill = {
  readonly target: BufferView;
  readonly sample?: Uint8Array;
  readonly classes?: Uint16Array;
  readonly seed: Point;
  readonly index: number;
  readonly mode: FillMode;
  readonly connectivity?: Connectivity;
  readonly mask?: MaskView | null;
  readonly wrap?: Wrap;
  readonly ink?: InkRule | null;
};

export type { RegionFill };
