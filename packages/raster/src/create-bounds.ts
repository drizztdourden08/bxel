/* @layer core @kind logic */
import type { Bounds } from './bounds.type';

const createBounds = (): Bounds => ({
  minX: Number.MAX_SAFE_INTEGER,
  minY: Number.MAX_SAFE_INTEGER,
  maxX: -1,
  maxY: -1,
});

export { createBounds };
