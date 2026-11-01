/* @layer core @kind types */
import type { BufferView, MaskView } from '../buffer.type';
import type { Connectivity } from '../fill.type';
import type { Point } from '../geometry.type';

type CombineMode = 'replace' | 'add' | 'subtract' | 'intersect';
type MorphMode = 'dilate' | 'erode';
type SweepAxis = 'row' | 'column';

type WandOptions = {
  readonly target: BufferView;
  readonly seed: Point;
  readonly connectivity: Connectivity;
};

type MatchOptions = {
  readonly target: BufferView;
  readonly seed: Point;
  readonly seedIndex?: number;
  readonly contiguous: boolean;
  readonly connectivity: Connectivity;
  readonly matches: (seed: number, index: number) => boolean;
  readonly ignore?: (index: number) => boolean;
  readonly within?: MaskView | null;
};

type Sweep = {
  readonly lines: number;
  readonly length: number;
  readonly lineStep: number;
  readonly step: number;
};

export type { CombineMode, MatchOptions, MorphMode, Sweep, SweepAxis, WandOptions };
