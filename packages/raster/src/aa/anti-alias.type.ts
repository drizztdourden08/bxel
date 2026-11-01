/* @layer core @kind types */
interface AntiAliasInput {
  readonly pixels: Uint8Array;
  readonly width: number;
  readonly height: number;
  readonly edge: number;
  readonly mid: number;
  readonly inside: boolean;
}

interface AntiAliasPixel {
  readonly x: number;
  readonly y: number;
  readonly index: number;
}

interface Grid {
  readonly pixels: Uint8Array;
  readonly width: number;
  readonly height: number;
}

interface Run {
  readonly x: number;
  readonly end: number;
  readonly y: number;
}

export type { AntiAliasInput, AntiAliasPixel, Grid, Run };
