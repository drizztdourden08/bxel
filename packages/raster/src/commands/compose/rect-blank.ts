/* @layer core @kind logic */
import type { Sprite } from '@bxel/document';
import type { Rect } from '../../geometry.type';

const rowsBlank = (pixels: Uint8Array, stride: number, rect: Rect): boolean => {
  for (let row = 0; row < rect.height; row += 1) {
    const start = (rect.y + row) * stride + rect.x;
    if (pixels.subarray(start, start + rect.width).some((value) => value !== 0)) return false;
  }
  return true;
};

const rectBlank = (sprite: Sprite, rect: Rect): boolean =>
  Object.values(sprite.cels).every((cel) => rowsBlank(cel.pixels, sprite.width, rect));

export { rectBlank };
