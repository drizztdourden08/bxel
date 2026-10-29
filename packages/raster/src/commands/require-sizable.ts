/* @layer core @kind logic */
import { requireSprite } from '@bxel/document';
import type { Draft, Sprite, SpriteId } from '@bxel/document';
import { checkSizable } from './check-sizable';

const requireSizable = (draft: Draft, spriteId: SpriteId): Sprite => {
  const sprite = requireSprite(draft.artwork, spriteId);
  checkSizable(sprite, 'Resize the animation instead.');
  return sprite;
};

export { requireSizable };
