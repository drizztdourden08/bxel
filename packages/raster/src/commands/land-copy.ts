/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import type { BufferView } from '../buffer.type';
import { createBounds } from '../create-bounds';
import type { Point, Rect } from '../geometry.type';
import { growBounds } from '../grow-bounds';
import type { SourceRegion } from './source-region.type';

const sourceValue = (source: SourceRegion, x: number, y: number): number => {
  const { rect, sprite } = source;
  const inside = rect.x + x < sprite.width && rect.y + y < sprite.height;
  const from = (rect.y + y) * sprite.width + rect.x + x;
  const allowed = source.mask === undefined || (source.mask.bits[from] ?? 0) !== 0;
  return inside && allowed ? (source.pixels[from] ?? 0) : 0;
};

const fits = (target: BufferView, x: number, y: number): boolean => x >= 0 && y >= 0 && x < target.width && y < target.height;

const landCopy = (target: BufferView, source: SourceRegion, at: Point, lookup: Uint8Array | null): Rect | null => {
  const bounds = createBounds();
  for (let y = 0; y < source.rect.height; y++) {
    for (let x = 0; x < source.rect.width; x++) {
      const value = sourceValue(source, x, y);
      const [tx, ty] = [at.x + x, at.y + y];
      if (value === 0 || !fits(target, tx, ty)) continue;
      target.pixels[ty * target.width + tx] = lookup ? (lookup[value] ?? 0) : value;
      growBounds(bounds, tx, ty);
    }
  }
  return boundsToRect(bounds);
};

export { landCopy };
