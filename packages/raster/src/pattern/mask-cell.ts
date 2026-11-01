/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import { foldCoord } from '../fold-coord';

/** Whether a saved brush used as a two colour mask is on at a canvas cell. Any painted pixel of the brush counts as on. */
const maskCell = (mask: BufferView, origin: { readonly x: number; readonly y: number }, x: number, y: number): boolean =>
  (mask.pixels[foldCoord(y - origin.y, mask.height) * mask.width + foldCoord(x - origin.x, mask.width)] ?? 0) !== 0;

export { maskCell };
