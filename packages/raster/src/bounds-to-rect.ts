/* @layer core @kind logic */
import type { Bounds } from './bounds.type';
import type { Rect } from './geometry.type';

const boundsToRect = (bounds: Bounds): Rect | null => {
  if (bounds.maxX < bounds.minX || bounds.maxY < bounds.minY) {
    return null;
  }
  return {
    x: bounds.minX,
    y: bounds.minY,
    width: bounds.maxX - bounds.minX + 1,
    height: bounds.maxY - bounds.minY + 1,
  };
};

export { boundsToRect };
