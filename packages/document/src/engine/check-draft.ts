/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Draft } from '../draft/draft.type';
import { hasIndexAtLeast } from '../pixels/has-index-at-least';
import { findBank } from '../read/find-bank';
import { findSprite } from '../read/find-sprite';
import { nameKey } from '../validate/name-key';
import { checkAnimations } from './check-animations';
import { checkSheets } from './check-sheets';
import { checkTiles } from './check-tiles';

const hasDuplicate = (names: readonly string[]): boolean => new Set(names.map(nameKey)).size !== names.length;

const checkNames = (draft: Draft): void => {
  const { sprites } = draft.artwork;
  if (hasDuplicate(sprites.map((sprite) => sprite.name))) {
    throw fail(ERROR_CODE.NAME_TAKEN, 'Sprite names must be unique in a file.');
  }
  for (const sprite of sprites) {
    const base = findSprite(draft.base, sprite.id);
    if (base?.layers !== sprite.layers && hasDuplicate(sprite.layers.map((layer) => layer.name))) {
      throw fail(ERROR_CODE.NAME_TAKEN, `Layer names must be unique in sprite "${sprite.name}".`);
    }
    if (base?.tags !== sprite.tags && hasDuplicate(sprite.tags.map((tag) => tag.name))) {
      throw fail(ERROR_CODE.NAME_TAKEN, `Tag names must be unique in sprite "${sprite.name}".`);
    }
  }
};

const checkIndices = (draft: Draft): void => {
  for (const sprite of draft.artwork.sprites) {
    const bank = findBank(draft.artwork, sprite.bankId);
    const base = findSprite(draft.base, sprite.id);
    for (const cel of Object.values(sprite.cels)) {
      const untouched = base?.cels[cel.id]?.pixels === cel.pixels;
      if (bank && !untouched && hasIndexAtLeast(cel.pixels, bank.slots.length)) {
        throw fail(ERROR_CODE.INDEX_OUT_OF_RANGE, `A pixel index is at or above the ${bank.slots.length} slots of bank "${bank.name}".`);
      }
    }
  }
};

const checkDraft = (draft: Draft): void => {
  checkNames(draft);
  checkIndices(draft);
  checkSheets(draft.artwork, draft.base);
  checkAnimations(draft);
  checkTiles(draft);
};

export { checkDraft };
