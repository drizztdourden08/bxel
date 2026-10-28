/* @layer core @kind types */
import type { Point } from './geometry.type';

type Symmetry = {
  readonly x2?: number | null;
  readonly y2?: number | null;
  readonly diagonal?: boolean;
  readonly turn4?: boolean;
};
type MirrorOptions = { readonly points: readonly Point[]; readonly symmetry: Symmetry; readonly span?: number };

type PointMap = (point: Point) => Point;

export type { MirrorOptions, PointMap, Symmetry };
