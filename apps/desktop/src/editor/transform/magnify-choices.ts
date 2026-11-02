/* @layer renderer-app @kind logic */
import type { ResampleAlgorithm } from '@bxel/raster';
import { TRIPLE } from './magnify-choices.constants';
import { magnifyFactor } from './magnify-factor';
import { MAGNIFY_ALGORITHMS } from './transform.constants';
import type { TransformSpec } from './transform.type';

const fits = (algorithm: ResampleAlgorithm, factor: number): boolean =>
  algorithm === 'scale3x' ? factor % TRIPLE === 0 : Number.isInteger(Math.log2(factor));

const magnifyChoices = (spec: TransformSpec): readonly ResampleAlgorithm[] => {
  const factor = magnifyFactor(spec);
  if (factor === null) return [];
  return MAGNIFY_ALGORITHMS.filter((each) => fits(each, factor));
};

export { magnifyChoices };
