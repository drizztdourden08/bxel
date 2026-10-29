/* @layer core @kind types */
import type { ResampleAlgorithm, ResampleOptions } from '../resample/resample.type';
import type { Geometry, MoverView } from './region.type';

type ResampledSpec = {
  readonly geometry: (view: MoverView) => Geometry;
  readonly algorithm: ResampleAlgorithm;
  readonly options: ResampleOptions;
  readonly scale: (view: MoverView, geometry: Geometry) => number;
};

export type { ResampledSpec };
