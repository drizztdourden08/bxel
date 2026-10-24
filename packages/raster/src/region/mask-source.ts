/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';

const maskSource = (mask: MaskView, x: number, y: number): number => {
  if (x < 0 || y < 0 || x >= mask.width || y >= mask.height) {
    return -1;
  }
  const at = y * mask.width + x;
  return (mask.bits[at] ?? 0) === 0 ? -1 : at;
};

export { maskSource };
