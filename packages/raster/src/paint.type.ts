/* @layer core @kind types */
import type { BufferView, MaskView } from './buffer.type';
import type { Bounds } from './bounds.type';
import type { Brush, BrushStamp } from './brush.type';
import type { Corners, Point } from './geometry.type';
import type { InkRule } from './ink/ink.type';
import type { Symmetry } from './symmetry.type';
import type { Wrap } from './wrap.type';

type PaintTarget = {
  readonly target: BufferView;
  readonly index: number;
  readonly mask?: MaskView | null;
  readonly wrap?: Wrap;
  readonly ink?: InkRule | null;
};

type StrokeOptions = PaintTarget & {
  readonly points: readonly Point[];
  readonly brush: Brush;
  readonly pixelPerfect?: boolean;
  readonly symmetry?: Symmetry;
};

type PlotOptions = PaintTarget & {
  readonly points: readonly Point[];
  readonly brush: Brush;
  readonly symmetry?: Symmetry;
};

type ShapeKind = 'line' | 'rect' | 'ellipse';

type ShapeOptions = PaintTarget &
  Corners & {
    readonly shape: ShapeKind;
    readonly filled?: boolean;
    readonly fillIndex?: number;
    readonly radius?: number;
    readonly evenSteps?: boolean;
    readonly brush?: Brush;
    readonly symmetry?: Symmetry;
  };

type PixelWriter = {
  readonly target: BufferView;
  readonly mask: MaskView | null;
  readonly wrap: Wrap;
  readonly index: number;
  readonly bounds: Bounds;
  readonly ink: InkRule | null;
  readonly once: Uint8Array | null;
};

type ShapePass = {
  readonly writer: PixelWriter;
  readonly fillWriter: PixelWriter;
  readonly stamp: BrushStamp;
  readonly shape: ShapeKind;
  readonly filled: boolean;
  readonly outlined: boolean;
  readonly radius: number;
  readonly evenSteps: boolean;
};

export type { PaintTarget, PixelWriter, PlotOptions, ShapeKind, ShapeOptions, ShapePass, StrokeOptions };
