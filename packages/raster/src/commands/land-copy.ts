/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import type { BufferView } from '../buffer.type';
import { createBounds } from '../create-bounds';
import type { Point, Rect } from '../geometry.type';
import { growBounds } from '../grow-bounds';
import type { SourceRegion } from './source-region';

const landCopy = (target: BufferView, source: SourceRegion, at: Point, lookup: Uint8Array | null): Rect | null => {
  const bounds = createBounds();
  const { rect, sprite } = source;
  for (let y = 0; y < rect.height; y++) {
    for (let x = 0; x < rect.width; x++) {
      const from = (rect.y + y) * sprite.width + rect.x + x;
      const value = rect.x + x < sprite.width && rect.y + y < sprite.height ? (source.pixels[from] ?? 0) : 0;
      const allowed = source.mask === undefined || (source.mask.bits[from] ?? 0) !== 0;
      const [tx, ty] = [at.x + x, at.y + y];
      const inside = tx >= 0 && ty >= 0 && tx < target.width && ty < target.height;
      if (value === 0 || !allowed || !inside) continue;
      target.pixels[ty * target.width + tx] = lookup ? (lookup[value] ?? 0) : value;
      growBounds(bounds, tx, ty);
    }
  }
  return boundsToRect(bounds);
};

export { landCopy };
