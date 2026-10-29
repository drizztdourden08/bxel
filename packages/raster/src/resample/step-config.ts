/* @layer core @kind logic */
import { DEFAULT_STEP } from './resample.constants';
import type { ResampleOptions, StepConfig } from './resample.type';

const stepConfig = (options: ResampleOptions, equal: boolean): StepConfig => {
  const { luma, distance, similar } = options;
  const table = luma;
  const lumaOf = table ? (index: number): number => table[index] ?? DEFAULT_STEP.luma(index) : DEFAULT_STEP.luma;
  const near = distance !== undefined && similar !== undefined && similar > 0 && !equal;
  return {
    border: 'transparent',
    luma: lumaOf,
    same: near ? (a, b) => a === b || distance(a, b) <= similar : DEFAULT_STEP.same,
  };
};

export { stepConfig };
