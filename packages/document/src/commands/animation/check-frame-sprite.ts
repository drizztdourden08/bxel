/* @layer core @kind logic */
import type { Animation } from '../../model/animation.type';
import type { Artwork } from '../../model/artwork.type';
import type { SpriteId } from '../../model/ids.type';
import type { Sprite } from '../../model/sprite.type';
import { requireSprite } from '../../read/require-sprite';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const checkFrameSprite = (
  artwork: Artwork,
  animation: Pick<Animation, 'name' | 'bankId' | 'frames'>,
  spriteId: SpriteId,
  path: string,
): Sprite => {
  const sprite = requireSprite(artwork, spriteId);
  if (sprite.role === 'tile') {
    throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${sprite.name}" is a tile and cannot be a frame.`, { path });
  }
  const mine = animation.frames.some((frame) => frame.spriteId === sprite.id);
  if (sprite.role === 'frame' && !mine) {
    throw fail(ERROR_CODE.SPRITE_OWNED, `Sprite "${sprite.name}" belongs to another animation.`, { path });
  }
  if (sprite.bankId !== animation.bankId) {
    throw fail(ERROR_CODE.PALETTE_MISMATCH, `Sprite "${sprite.name}" uses another palette than animation "${animation.name}".`, { path });
  }
  return sprite;
};

export { checkFrameSprite };
