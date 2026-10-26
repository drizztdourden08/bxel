/* @layer core @kind logic */
import { addSprite } from '../../draft/add-sprite';
import { cloneSprite } from '../../draft/clone-sprite';
import type { Draft } from '../../draft/draft.type';
import type { Sprite } from '../../model/sprite.type';
import { freeName } from '../layer/free-name';
import { OWNED_SPRITE_NAME } from './animation.constants';

const ownedCopy = (draft: Draft, owner: string, source: Sprite): Sprite => {
  const taken = draft.artwork.sprites.map((sprite) => sprite.name);
  const name = freeName(taken, `${owner}${OWNED_SPRITE_NAME}`);
  const sprite: Sprite = { ...cloneSprite(draft.ids, source, name, draft.stamp), role: 'frame' };
  addSprite(draft, sprite);
  return sprite;
};

export { ownedCopy };
