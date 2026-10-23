/* @layer core @kind logic */
import type { Bounds } from './bounds.type';

const growBounds = (bounds: Bounds, x: number, y: number): void => {
  bounds.minX = Math.min(bounds.minX, x);
  bounds.minY = Math.min(bounds.minY, y);
  bounds.maxX = Math.max(bounds.maxX, x);
  bounds.maxY = Math.max(bounds.maxY, y);
};

export { growBounds };
