/* @layer core @kind logic */
import { nearestIndex } from './nearest-index';

const cachedNearest = (cache: Map<number, number>, rgb: number, table: Int32Array): number => {
  const hit = cache.get(rgb);
  if (hit !== undefined) return hit;
  const found = nearestIndex(rgb, table);
  cache.set(rgb, found);
  return found;
};

export { cachedNearest };
