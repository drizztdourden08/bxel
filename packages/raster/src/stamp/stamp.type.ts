/* @layer core @kind types */
import type { BufferView, MaskView } from '../buffer.type';
import type { Point } from '../geometry.type';
import type { InkRule } from '../ink/ink.type';
import type { Symmetry } from '../symmetry.type';
import type { Wrap } from '../wrap.type';

type StampTurn = 0 | 90 | 180 | 270;

type StampOrient = { readonly flipX?: boolean; readonly flipY?: boolean; readonly turn?: StampTurn };

type StampOptions = StampOrient & {
  readonly target: BufferView;
  readonly patch: BufferView;
  readonly points: readonly Point[];
  readonly anchor?: Point | null;
  readonly skipZero: boolean;
  readonly mask?: MaskView | null;
  readonly wrap?: Wrap;
  readonly symmetry?: Symmetry;
  readonly ink?: InkRule | null;
};

export type { StampOptions, StampOrient, StampTurn };
