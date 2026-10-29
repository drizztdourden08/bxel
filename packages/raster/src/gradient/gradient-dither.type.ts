/* @layer core @kind types */
import type { GradientPattern } from './gradient.type';

type DitherGrid = { readonly matrix: Uint8Array; readonly side: number };

type GradientDither = { readonly style: GradientPattern; readonly grid: DitherGrid };

export type { DitherGrid, GradientDither };
