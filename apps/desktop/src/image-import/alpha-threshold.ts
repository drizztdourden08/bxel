/* @layer renderer-app @kind logic */
import { BYTE_MAX, PERCENT } from './image-import.constants';

const alphaThreshold = (percent: number): number => {
  const clamped = Math.min(PERCENT, Math.max(0, Number.isFinite(percent) ? percent : 0));
  return Math.round((clamped * BYTE_MAX) / PERCENT);
};

export { alphaThreshold };
