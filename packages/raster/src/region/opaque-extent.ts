/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import type { Extent } from '../geometry.type';

const widen = (found: Extent | null, x: number, y: number): Extent =>
  found
    ? { x0: Math.min(found.x0, x), y0: Math.min(found.y0, y), x1: Math.max(found.x1, x), y1: Math.max(found.y1, y) }
    : { x0: x, y0: y, x1: x, y1: y };

const scanBuffer = (source: BufferView, start: Extent | null): Extent | null => {
  let found = start;
  source.pixels.forEach((value, at) => {
    if (value !== 0) found = widen(found, at % source.width, Math.floor(at / source.width));
  });
  return found;
};

const opaqueExtent = (sources: readonly BufferView[]): Extent | null => {
  let found: Extent | null = null;
  for (const source of sources) found = scanBuffer(source, found);
  return found;
};

export { opaqueExtent };
