/* @layer core @kind types */
interface Grid {
  readonly pixels: Uint8Array;
  readonly width: number;
  readonly height: number;
}

interface Run {
  readonly start: number;
  readonly end: number;
  readonly index: number;
}

interface Spot {
  readonly x: number;
  readonly y: number;
  readonly index: number;
}

export type { Grid, Run, Spot };
