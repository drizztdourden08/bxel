/* @layer core @kind types */
import type { BufferView, MaskView } from '../buffer.type';
import type { Corners, Point } from '../geometry.type';

type BayerSize = 2 | 4 | 8;

type GradientOptions = {
  readonly target: BufferView;
  readonly mask?: MaskView | null;
  readonly colors: readonly number[];
  readonly line: Corners;
  readonly bayer: BayerSize | null;
  readonly origin: Point;
};

type GradientPick = {
  readonly colors: readonly number[];
  readonly position: number;
  readonly threshold: number | null;
};

export type { BayerSize, GradientOptions, GradientPick };
