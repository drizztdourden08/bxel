/* @layer core @kind logic */
import type { SpriteId } from '../model/ids.type';
import type { Sprite } from '../model/sprite.type';
import { replaceSprite } from '../artwork/replace-sprite';
import { requireSprite } from '../read/require-sprite';
import type { Draft } from './draft.type';

const updateSprite = (draft: Draft, spriteId: SpriteId, change: (sprite: Sprite) => Sprite): void => {
  draft.artwork = replaceSprite(draft.artwork, change(requireSprite(draft.artwork, spriteId)));
};

export { updateSprite };
