/* @layer core @kind logic */
import type { SpriteId } from '../model/ids.type';
import type { Sprite } from '../model/sprite.type';
import { replaceSprite } from '../project/replace-sprite';
import { requireSprite } from '../read/require-sprite';
import type { Draft } from './draft.type';

const updateSprite = (draft: Draft, spriteId: SpriteId, change: (sprite: Sprite) => Sprite): void => {
  draft.project = replaceSprite(draft.project, change(requireSprite(draft.project, spriteId)));
};

export { updateSprite };
