/* @layer renderer-app @kind logic */
import { FIT_LIMITS } from '../stores/timeline-store.constants';
import { trackLayout } from './track-layout';

const fitThumb = (durations: readonly number[], available: number, timeMode: boolean): number => {
  const sizes = Array.from({ length: Math.max(0, FIT_LIMITS.max - FIT_LIMITS.min) }, (_, step) => FIT_LIMITS.max - step);
  return sizes.find((thumb) => trackLayout(durations, thumb, timeMode).total <= available) ?? FIT_LIMITS.min;
};

export { fitThumb };
