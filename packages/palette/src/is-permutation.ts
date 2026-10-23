/* @layer core @kind logic */
import { REMAP_SIZE } from './remap-size.constants';

const isPermutation = (order: readonly number[]): boolean => {
  if (order.length < 1 || order.length > REMAP_SIZE) return false;
  const seen = new Set<number>();
  for (const slot of order) {
    if (!Number.isInteger(slot) || slot < 0 || slot >= order.length) return false;
    seen.add(slot);
  }
  return seen.size === order.length;
};

export { isPermutation };
