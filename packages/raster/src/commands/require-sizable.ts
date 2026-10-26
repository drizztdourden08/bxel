/* @layer core @kind logic */
import { ERROR_CODE, fail, requireSprite } from '@bxel/document';
import type { Draft, Sprite, SpriteId } from '@bxel/document';

const requireSizable = (draft: Draft, spriteId: SpriteId): Sprite => {
  const sprite = requireSprite(draft.artwork, spriteId);
  if (sprite.role === 'tile') {
    throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${sprite.name}" is a tile and keeps the size of its tileset.`);
  }
  if (sprite.role === 'frame') {
    throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${sprite.name}" is a frame of an animation. Resize the animation instead.`);
  }
  return sprite;
};

export { requireSizable };
