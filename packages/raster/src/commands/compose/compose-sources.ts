/* @layer core @kind logic */
import { requireSprite } from '@bxel/document';
import type { Draft, Sprite, SpriteId } from '@bxel/document';
import { checkSizable } from '../check-sizable';

const composeSources = (draft: Draft, ids: readonly SpriteId[]): Sprite[] =>
  ids.map((id) => {
    const sprite = requireSprite(draft.artwork, id);
    checkSizable(sprite, 'Use the animation instead.');
    return sprite;
  });

export { composeSources };
