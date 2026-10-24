/* @layer core @kind types */
import type { Pivot2 } from '@bxel/document';
import type { BufferView, MaskView } from '../buffer.type';
import type { Rect } from '../geometry.type';

type BoundsPolicy = 'expand' | 'crop' | 'cancel';

type Anchor =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

type Halves = { readonly x: number; readonly y: number };

type ScaleTarget =
  | { readonly by: 'factor'; readonly x: number; readonly y: number }
  | { readonly by: 'size'; readonly width: number; readonly height: number };

type ScaleSpec = { readonly target: ScaleTarget; readonly anchor: Anchor };

type Resample = { readonly area: Rect; readonly source: (x: number, y: number) => number };

type MoverView = { readonly mask: MaskView; readonly box: Rect; readonly pivot: Pivot2 };

type Mover = (view: MoverView) => Resample;

type Lift = {
  readonly target: BufferView;
  readonly before: Uint8Array;
  readonly resample: Resample;
  readonly skipZero: boolean;
};

type LandOptions = {
  readonly target: BufferView;
  readonly mask: MaskView;
  readonly resample: Resample;
  readonly skipZero: boolean;
};

type LandResult = { readonly rect: Rect | null; readonly clipped: number };

type RotationTerms = { readonly cos: number; readonly sin: number };

export type {
  Anchor,
  BoundsPolicy,
  Halves,
  LandOptions,
  LandResult,
  Lift,
  Mover,
  MoverView,
  Resample,
  RotationTerms,
  ScaleSpec,
  ScaleTarget,
};
