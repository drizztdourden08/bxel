/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import { MAX_TARGET_SPRITES } from '../model/limits.constants';
import type { SpriteId } from '../model/ids.type';
import { findSprite } from '../read/find-sprite';
import type { ResolveSpritesInput } from './resolved-scope.type';

const resolveSprites = ({ artwork, refs, created }: ResolveSpritesInput): SpriteId[] => {
  const ids = new Set<SpriteId>();
  for (const [index, ref] of refs.entries()) {
    const id = (typeof ref === 'string' ? ref : created[ref.ref]) as SpriteId | undefined;
    if (id === undefined || !findSprite(artwork, id)) {
      throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Sprite target ${index} does not resolve.`, {
        path: `targets.sprites.${index}`,
      });
    }
    ids.add(id);
  }
  if (ids.size > MAX_TARGET_SPRITES) {
    throw fail(ERROR_CODE.BATCH_TOO_LARGE, `A step targets at most ${MAX_TARGET_SPRITES} sprites.`);
  }
  return [...ids];
};

export { resolveSprites };
