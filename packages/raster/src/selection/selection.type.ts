/* @layer core @kind types */
import type { BufferView } from '../buffer.type';
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

type Sweep = {
  readonly lines: number;
  readonly length: number;
  readonly lineStep: number;
  readonly step: number;
};

export type { CombineMode, MorphMode, Sweep, SweepAxis, WandOptions };
