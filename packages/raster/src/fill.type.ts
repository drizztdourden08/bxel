/* @layer core @kind types */
import type { BufferView, MaskView } from './buffer.type';
import type { Point } from './geometry.type';
import type { Wrap } from './wrap.type';

type FillMode = 'contiguous' | 'global';
type Connectivity = 4 | 8;

type FillOptions = {
  readonly target: BufferView;
  readonly seed: Point;
  readonly index: number;
  readonly mode: FillMode;
  readonly connectivity?: Connectivity;
  readonly mask?: MaskView | null;
  readonly wrap?: Wrap;
};

type FillPlan = {
  readonly target: BufferView;
  readonly mask: MaskView | null;
  readonly wrap: Wrap;
  readonly match: number;
  readonly index: number;
  readonly seed: Point;
  readonly reach: number;
};

export type { Connectivity, FillMode, FillOptions, FillPlan };
