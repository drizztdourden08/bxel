/* @layer core @kind types */
type Triple = readonly [number, number, number];

interface Oklab {
  readonly l: number;
  readonly a: number;
  readonly b: number;
}

interface Oklch {
  readonly l: number;
  readonly c: number;
  readonly h: number;
}

export type { Oklab, Oklch, Triple };
