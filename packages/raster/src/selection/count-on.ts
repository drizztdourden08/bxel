/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';

const isOn = (mask: MaskView, x: number, y: number): boolean =>
  x >= 0 && y >= 0 && x < mask.width && y < mask.height && (mask.bits[y * mask.width + x] ?? 0) !== 0;

export { isOn };
