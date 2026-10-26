/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { updateSprite } from '../../draft/update-sprite';
import type { SpriteId } from '../../model/ids.type';
import { requireSprite } from '../../read/require-sprite';
import { EMPTY_GUIDES } from './guide.constants';
import type { GuideAxis } from './guide.type';
import { withGuides } from './with-guides';

const sortedUnique = (positions: readonly number[]): number[] => [...new Set(positions)].sort((left, right) => left - right);

const setGuideLine = (draft: Draft, spriteId: SpriteId, axis: GuideAxis, positions: readonly number[]): void => {
  const guides = requireSprite(draft.artwork, spriteId).guides ?? EMPTY_GUIDES;
  updateSprite(draft, spriteId, (current) => withGuides(current, { ...guides, [axis]: sortedUnique(positions) }));
};

export { setGuideLine };
