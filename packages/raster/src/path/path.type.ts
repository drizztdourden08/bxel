/* @layer core @kind types */
import type { Brush } from '../brush.type';
import type { Point } from '../geometry.type';
import type { PaintTarget } from '../paint.type';
import type { Symmetry } from '../symmetry.type';

type PathKind = 'polygon' | 'curve' | 'contour';

type PathOptions = PaintTarget & {
  readonly kind: PathKind;
  readonly points: readonly Point[];
  readonly filled?: boolean;
  readonly brush?: Brush;
  readonly symmetry?: Symmetry;
};

export type { PathKind, PathOptions };
