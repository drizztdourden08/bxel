/* @layer core @kind types */
import type { BufferView, MaskView } from '../buffer.type';
import type { Corners, Point } from '../geometry.type';
import type { Wrap } from '../wrap.type';

type BayerSize = 2 | 4 | 8;

type GradientKind = 'linear' | 'radial';

type GradientPattern = 'bayer' | 'checker' | 'rows' | 'columns';

type GradientShape = { readonly kind?: GradientKind; readonly reflect?: boolean };

type GradientOptions = {
  readonly target: BufferView;
  readonly mask?: MaskView | null;
  readonly colors: readonly number[];
  readonly line: Corners;
  readonly bayer: BayerSize | null;
  readonly origin: Point;
  readonly kind?: GradientKind;
  readonly reflect?: boolean;
  readonly pattern?: GradientPattern;
  readonly wrap?: Wrap;
};

type GradientPick = {
  readonly colors: readonly number[];
  readonly position: number;
  readonly threshold: number | null;
};

export type { BayerSize, GradientKind, GradientOptions, GradientPattern, GradientPick, GradientShape };
