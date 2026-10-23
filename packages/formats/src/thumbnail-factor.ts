/* @layer core @kind logic */
import { clampFactor } from './clamp-factor';
import { PNG_LIMITS } from './png-limits.constants';

const thumbnailFactor = (
  width: number,
  height: number,
  maxSide: number = PNG_LIMITS.THUMBNAIL_MAX_SIDE,
): number => clampFactor(Math.floor(maxSide / Math.max(width, height, 1)));

export { thumbnailFactor };
