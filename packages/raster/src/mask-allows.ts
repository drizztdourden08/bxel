/* @layer core @kind logic */
import type { MaskView } from './buffer.type';

const maskAllows = (mask: MaskView | null | undefined, x: number, y: number): boolean => {
  if (!mask) {
    return true;
  }
  if (x < 0 || y < 0 || x >= mask.width || y >= mask.height) {
    return false;
  }
  return (mask.bits[y * mask.width + x] ?? 0) !== 0;
};

export { maskAllows };
