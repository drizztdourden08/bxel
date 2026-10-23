/* @layer core @kind types */
import type { ColorEntry } from './census.type';

type ExtractOptions = {
  readonly maxColors: number;
  readonly alphaThreshold?: number;
};

type ColorBox = {
  readonly entries: readonly ColorEntry[];
  readonly population: number;
  readonly channel: number;
  readonly span: number;
};

export type { ColorBox, ExtractOptions };
