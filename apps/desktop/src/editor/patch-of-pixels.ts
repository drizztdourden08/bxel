/* @layer renderer-app @kind logic */
import type { AntiAliasPixel, Rect } from '@bxel/raster';

const patchOfPixels = (found: readonly AntiAliasPixel[], width: number, height: number): { rect: Rect; pixels: Uint8Array } | null => {
  if (found.length === 0) return null;
  const left = Math.max(0, Math.min(...found.map((each) => each.x)));
  const top = Math.max(0, Math.min(...found.map((each) => each.y)));
  const right = Math.min(width - 1, Math.max(...found.map((each) => each.x)));
  const bottom = Math.min(height - 1, Math.max(...found.map((each) => each.y)));
  const rect = { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
  const pixels = new Uint8Array(rect.width * rect.height);
  for (const { x, y, index } of found) pixels[(y - top) * rect.width + (x - left)] = index;
  return { rect, pixels };
};

export { patchOfPixels };
