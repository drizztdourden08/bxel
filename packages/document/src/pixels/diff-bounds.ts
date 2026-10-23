/* @layer core @kind logic */
import type { Rect } from '../model/geometry.type';

const diffBounds = (before: Uint8Array, after: Uint8Array, width: number): Rect | null => {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = -1;
  let maxY = -1;
  for (const [index, value] of after.entries()) {
    if (value === before[index]) continue;
    const x = index % width;
    const y = Math.floor(index / width);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
};

export { diffBounds };
