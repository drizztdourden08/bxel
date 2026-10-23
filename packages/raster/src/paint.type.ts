/* @layer core @kind types */
import type { BufferView, MaskView } from './buffer.type';
import type { Bounds } from './bounds.type';
import type { Brush, BrushStamp } from './brush.type';
import type { Corners, Point } from './geometry.type';
import type { Symmetry } from './symmetry.type';

type PaintTarget = {
  readonly target: BufferView;
  readonly index: number;
  readonly mask?: MaskView | null;
};

type StrokeOptions = PaintTarget & {
  readonly points: readonly Point[];
  readonly brush: Brush;
  readonly pixelPerfect?: boolean;
  readonly symmetry?: Symmetry;
};

type ShapeKind = 'line' | 'rect' | 'ellipse';

type ShapeOptions = PaintTarget &
  Corners & {
    readonly shape: ShapeKind;
    readonly filled?: boolean;
    readonly brush?: Brush;
    readonly symmetry?: Symmetry;
  };

type PixelWriter = {
  readonly target: BufferView;
  readonly mask: MaskView | null;
  readonly index: number;
  readonly bounds: Bounds;
};

type ShapePass = {
  readonly writer: PixelWriter;
  readonly stamp: BrushStamp;
  readonly shape: ShapeKind;
  readonly filled: boolean;
};

export type { PaintTarget, PixelWriter, ShapeKind, ShapeOptions, ShapePass, StrokeOptions };
