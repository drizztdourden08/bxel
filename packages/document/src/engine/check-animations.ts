/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Draft } from '../draft/draft.type';
import type { Artwork } from '../model/artwork.type';
import { nameKey } from '../validate/name-key';
import { checkAnimation } from './check-animation';

const checkOwners = (artwork: Artwork): void => {
  const users = new Map<string, Set<string>>();
  for (const animation of artwork.animations) {
    for (const frame of animation.frames) {
      if (frame.spriteId !== null) users.set(frame.spriteId, (users.get(frame.spriteId) ?? new Set()).add(animation.id));
    }
  }
  for (const sprite of artwork.sprites) {
    if (sprite.role === 'frame' && (users.get(sprite.id)?.size ?? 0) !== 1) {
      throw fail(ERROR_CODE.REFERENCE_BROKEN, `Sprite "${sprite.name}" belongs to an animation and needs exactly one animation using it.`);
    }
  }
};

const checkAnimations = (draft: Draft): void => {
  const { artwork, base } = draft;
  if (artwork.animations === base.animations && artwork.sprites === base.sprites) return;
  const names = artwork.animations.map((animation) => nameKey(animation.name));
  if (new Set(names).size !== names.length) throw fail(ERROR_CODE.NAME_TAKEN, 'Animation names must be unique in a file.');
  for (const animation of artwork.animations) checkAnimation(artwork, animation);
  checkOwners(artwork);
};

export { checkAnimations };
