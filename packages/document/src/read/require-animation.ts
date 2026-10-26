/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Animation } from '../model/animation.type';
import type { Artwork } from '../model/artwork.type';
import type { AnimationId } from '../model/ids.type';
import { findAnimation } from './find-animation';

const requireAnimation = (artwork: Artwork, id: AnimationId): Animation => {
  const animation = findAnimation(artwork, id);
  if (!animation) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Animation ${id} does not exist.`);
  return animation;
};

export { requireAnimation };
