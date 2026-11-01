/* @layer core @kind types */
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

export type { Run, Spot };
