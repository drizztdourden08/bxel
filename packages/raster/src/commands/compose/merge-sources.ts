/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { Draft, Sprite, SpriteId } from '@bxel/document';
import { composeSources } from './compose-sources';

const mergeSources = (draft: Draft, ids: readonly SpriteId[]): readonly [Sprite, ...Sprite[]] => {
  const [lead, ...rest] = composeSources(draft, ids);
  if (!lead || rest.length === 0) throw fail(ERROR_CODE.INVALID_OPTION, 'Merging needs at least two sprites.');
  const odd = rest.find((sprite) => sprite.bankId !== lead.bankId);
  if (odd) {
    throw fail(ERROR_CODE.INCOMPATIBLE_TARGETS, `Sprite "${odd.name}" uses another palette than "${lead.name}". Give them one palette first.`);
  }
  return [lead, ...rest];
};

export { mergeSources };
