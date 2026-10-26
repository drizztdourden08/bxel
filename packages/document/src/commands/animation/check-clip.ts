/* @layer core @kind logic */
import type { Rect } from '../../model/geometry.type';
import type { Sprite } from '../../model/sprite.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const checkClip = (sprite: Sprite, clip: Rect, path: string): void => {
  const inside = clip.x >= 0 && clip.y >= 0 && clip.x + clip.width <= sprite.width && clip.y + clip.height <= sprite.height;
  if (!inside) {
    throw fail(ERROR_CODE.OUT_OF_BOUNDS, `The clip is outside sprite "${sprite.name}" (${sprite.width} by ${sprite.height}).`, { path });
  }
};

export { checkClip };
