/* @layer core @kind types */
type ColorEntry = {
  readonly rgb: number;
  readonly count: number;
};

type ColorCensus = {
  readonly colors: readonly ColorEntry[];
  readonly opaquePixels: number;
  readonly transparentPixels: number;
};

type CensusOptions = {
  readonly alphaThreshold?: number;
};

export type { CensusOptions, ColorCensus, ColorEntry };
