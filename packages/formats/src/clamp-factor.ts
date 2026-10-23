/* @layer core @kind logic */
import { PNG_LIMITS } from './png-limits.constants';

const clampFactor = (factor: number): number => {
  if (!Number.isFinite(factor)) return 1;
  return Math.min(PNG_LIMITS.UPSCALE_MAX_FACTOR, Math.max(1, Math.trunc(factor)));
};

export { clampFactor };
