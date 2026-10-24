/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import type { Rect } from '../geometry.type';

const insideRect = (rect: Rect, x: number, y: number): boolean =>
  x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height;

const countOpaque = (source: BufferView, outside: Rect): number => {
  let count = 0;
  for (let y = 0; y < source.height; y++) {
    for (let x = 0; x < source.width; x++) {
      if (!insideRect(outside, x, y) && source.pixels[y * source.width + x] !== 0) count++;
    }
  }
  return count;
};

export { countOpaque };
