/* @layer core @kind types */
import type { Point } from './geometry.type';

type Symmetry = { readonly x2?: number | null; readonly y2?: number | null };
type MirrorOptions = { readonly points: readonly Point[]; readonly symmetry: Symmetry; readonly span?: number };

export type { MirrorOptions, Symmetry };
