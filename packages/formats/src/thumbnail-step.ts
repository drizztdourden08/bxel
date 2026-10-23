/* @layer core @kind logic */
import { PNG_LIMITS } from './png-limits.constants';

const thumbnailStep = (
  width: number,
  height: number,
  maxSide: number = PNG_LIMITS.THUMBNAIL_MAX_SIDE,
): number => {
  const limit = Math.max(1, Math.floor(maxSide));
  return Math.max(1, Math.ceil(Math.max(width, height) / limit));
};

export { thumbnailStep };
