/* @layer core @kind logic */
import { APNG_LIMITS } from './apng-limits.constants';

const apngDelayMs = (num: number, den: number): number =>
  Math.max(1, Math.round((num * APNG_LIMITS.DELAY_DEN) / (den === 0 ? APNG_LIMITS.DEFAULT_DEN : den)));

export { apngDelayMs };
