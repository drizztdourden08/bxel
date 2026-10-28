/* @layer core @kind logic */
import { mmpx } from './mmpx';
import type { IndexImage, ResampleAlgorithm, StepConfig } from './resample.type';
import { scale2x } from './scale2x';
import { scale3x } from './scale3x';

type Magnified = { readonly image: IndexImage; readonly factor: number };

const STEPS: Readonly<Record<string, { factor: number; run: (image: IndexImage, config: StepConfig) => IndexImage }>> = {
  scale2x: { factor: 2, run: scale2x },
  scale3x: { factor: 3, run: scale3x },
  mmpx: { factor: 2, run: mmpx },
};

/** Applies a magnifier repeatedly until the image is at least `scale` times larger. */
const magnify = (image: IndexImage, algorithm: ResampleAlgorithm, scale: number, config: StepConfig): Magnified => {
  const step = STEPS[algorithm];
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
export type { Magnified };
