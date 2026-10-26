/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';

const inside = (x: number, y: number, limit: Rect): boolean =>
  x >= limit.x && y >= limit.y && x < limit.x + limit.width && y < limit.y + limit.height;

const lockPastePixels = (rect: Rect, pixels: Uint8Array, limit: Rect | null): Uint8Array => {
  if (!limit) return pixels;
  return Uint8Array.from(pixels, (value, at) => (inside(rect.x + (at % rect.width), rect.y + Math.floor(at / rect.width), limit) ? value : 0));
};

export { lockPastePixels };
