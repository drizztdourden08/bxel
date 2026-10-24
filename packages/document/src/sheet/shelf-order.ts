/* @layer core @kind logic */
import type { Size } from '../model/geometry.type';

const shelfOrder = (sizes: readonly Size[]): number[] => {
  const key = (index: number, side: 'width' | 'height'): number => sizes[index]?.[side] ?? 0;
  return sizes
    .map((_, index) => index)
    .sort((a, b) => key(b, 'height') - key(a, 'height') || key(b, 'width') - key(a, 'width') || a - b);
};

export { shelfOrder };
