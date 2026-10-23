/* @layer core @kind types */
import type { RgbaImage } from './image.type';

type BayerSize = 2 | 4 | 8;

type MapOptions = {
  readonly palette: readonly string[];
  readonly transparent: boolean;
  readonly alphaThreshold?: number;
};

type DitherOptions = MapOptions & {
  readonly size: BayerSize;
  readonly spread?: number;
  readonly originX?: number;
  readonly originY?: number;
};

type DitherPlan = {
  readonly size: number;
  readonly offsets: Int32Array;
  readonly originX: number;
  readonly originY: number;
};

type MapImageOptions = {
  readonly image: RgbaImage;
  readonly table: Int32Array;
  readonly alphaThreshold: number;
  readonly dither: DitherPlan | null;
};

export type { BayerSize, DitherOptions, DitherPlan, MapImageOptions, MapOptions };
