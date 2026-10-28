/* @layer core @kind logic */
import { makeSampler } from '../resample/make-sampler';
import type { ResampleAlgorithm, ResampleOptions } from '../resample/resample.type';
import { maskSource } from './mask-source';
import { regionImage } from './region-image';
import type { Geometry, Mover, MoverView } from './region.type';

type ResampledSpec = {
  readonly geometry: (view: MoverView) => Geometry;
  readonly algorithm: ResampleAlgorithm;
  readonly options: ResampleOptions;
  readonly scale: (view: MoverView, geometry: Geometry) => number;
};

/**
 * Builds a mover from an inverse mapping. Nearest keeps the plain index lookup; every other
 * algorithm samples a magnified copy of the region, and only returns indexes the region holds.
 */
const resampledMover =
  (spec: ResampledSpec): Mover =>
  (view) => {
    const { mask, box } = view;
    const geometry = spec.geometry(view);
    const source = (x: number, y: number): number => {
      const at = geometry.inverse(x, y);
      return maskSource(mask, Math.floor(at.x), Math.floor(at.y));
    };
    if (spec.algorithm === 'nearest') return { area: geometry.area, source };
    return {
      area: geometry.area,
      source,
      prepare: (before) => {
        const image = regionImage(before, mask, box);
        const scale = spec.scale(view, geometry);
        const sampler = makeSampler({ image, algorithm: spec.algorithm, scale, options: spec.options });
        return (x, y) => {
          const at = geometry.inverse(x, y);
          const value = sampler(at.x - box.x, at.y - box.y);
          return value === 0 && source(x, y) < 0 ? -1 : value;
        };
      },
    };
  };

export { resampledMover };
export type { ResampledSpec };
