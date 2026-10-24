/* @layer renderer-app @kind logic */
import type { NumberRange } from './canvas-look.type';

const clampSetting = (value: unknown, range: NumberRange, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(range.max, Math.max(range.min, value));
};

export { clampSetting };
