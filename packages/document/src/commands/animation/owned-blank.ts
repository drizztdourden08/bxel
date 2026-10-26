/* @layer core @kind logic */
import { addSprite } from '../../draft/add-sprite';
import type { Draft } from '../../draft/draft.type';
import type { Size } from '../../model/geometry.type';
import type { BankId } from '../../model/ids.type';
import type { Sprite } from '../../model/sprite.type';
import { freeName } from '../layer/free-name';
import { buildSprite } from '../sprite/build-sprite';
import { OWNED_SPRITE_NAME } from './animation.constants';

const ownedBlank = (draft: Draft, owner: string, size: Size, bankId: BankId): Sprite => {
  const taken = draft.artwork.sprites.map((sprite) => sprite.name);
  const name = freeName(taken, `${owner}${OWNED_SPRITE_NAME}`);
  const base = buildSprite({ ids: draft.ids, name, width: size.width, height: size.height, bankId, pivot: null, created: draft.stamp });
  const sprite: Sprite = { ...base, role: 'frame' };
  addSprite(draft, sprite);
  return sprite;
};

export { ownedBlank };
