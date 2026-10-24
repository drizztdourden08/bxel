/* @layer core @kind types */
import type { BufferView, MaskView } from '../buffer.type';
import type { Brush } from '../brush.type';
import type { Point } from '../geometry.type';
import type { Symmetry } from '../symmetry.type';

type ShadeDirection = 'up' | 'down';

type ShadeStroke = {
  readonly target: BufferView;
  readonly table: Uint8Array;
  readonly mask?: MaskView | null;
  readonly points: readonly Point[];
  readonly brush: Brush;
  readonly pixelPerfect?: boolean;
  readonly symmetry?: Symmetry;
};

type ShadeSteps = { readonly slots: readonly number[]; readonly direction: ShadeDirection; readonly steps: number };

export type { ShadeDirection, ShadeSteps, ShadeStroke };
