/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import { foldCoord } from '../fold-coord';

const maskCell = (mask: BufferView, origin: { readonly x: number; readonly y: number }, x: number, y: number): boolean =>
  (mask.pixels[foldCoord(y - origin.y, mask.height) * mask.width + foldCoord(x - origin.x, mask.width)] ?? 0) !== 0;

export { maskCell };
