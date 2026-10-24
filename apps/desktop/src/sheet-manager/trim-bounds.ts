/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import type { Rect, Sprite } from '@bxel/document';

const trimBounds = (sprite: Sprite): Rect => {
  const frame = sprite.frames[0];
  const pixels = frame ? flattenFrame(sprite, frame.id) : new Uint8Array(0);
  let left = sprite.width;
  let top = sprite.height;
  let right = -1;
  let bottom = -1;
  pixels.forEach((value, at) => {
    if (value === 0) return;
    const x = at % sprite.width;
    const y = Math.floor(at / sprite.width);
    left = Math.min(left, x);
    top = Math.min(top, y);
    right = Math.max(right, x);
    bottom = Math.max(bottom, y);
  });
  return right < 0 ? { x: 0, y: 0, width: 1, height: 1 } : { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
};

export { trimBounds };
