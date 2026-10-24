/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { SpriteId } from '../model/ids.type';
import type { Artwork } from '../model/artwork.type';
import type { Sprite } from '../model/sprite.type';
import { findSprite } from './find-sprite';

const requireSprite = (artwork: Artwork, id: SpriteId): Sprite => {
  const sprite = findSprite(artwork, id);
  if (!sprite) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Sprite ${id} does not exist.`);
  return sprite;
};

export { requireSprite };
