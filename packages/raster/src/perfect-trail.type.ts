/* @layer core @kind types */
import type { Point } from './geometry.type';

type PerfectTrail = { readonly kept: Point[]; last: Point | null };

type TrailChange = { readonly removed: readonly Point[]; readonly added: readonly Point[] };

export type { PerfectTrail, TrailChange };
