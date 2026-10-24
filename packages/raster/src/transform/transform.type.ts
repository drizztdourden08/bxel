/* @layer core @kind types */
import type { BufferView, MaskView } from '../buffer.type';
import type { Rect } from '../geometry.type';

type Orientation = 'flip-horizontal' | 'flip-vertical' | 'turn-clockwise' | 'turn-counter-clockwise' | 'half-turn';

type TransformPlan = {
  readonly turned: boolean;
  readonly to: (x: number, y: number, width: number, height: number) => number;
};

type RegionOptions = {
  readonly target: BufferView;
  readonly mask: MaskView;
  readonly orientation: Orientation;
};

type RegionResult = { readonly rect: Rect | null; readonly clipped: number };

type MoveVisitor = (from: number, to: number) => void;

export type { MoveVisitor, Orientation, RegionOptions, RegionResult, TransformPlan };
