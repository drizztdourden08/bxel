/* @layer core @kind logic */
import { MAGNIFIERS } from './magnify.constants';
import type { Magnified } from './magnify.type';
import type { IndexImage, ResampleAlgorithm, StepConfig } from './resample.type';

const magnify = (image: IndexImage, algorithm: ResampleAlgorithm, scale: number, config: StepConfig): Magnified => {
  const step = MAGNIFIERS[algorithm];
  if (!step || scale <= 1) return { image, factor: 1 };
  let current = image;
  let factor = 1;
  while (factor < scale) {
    current = step.run(current, config);
    factor *= step.factor;
  }
  return { image: current, factor };
};

export { magnify };
