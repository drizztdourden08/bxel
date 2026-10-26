/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { SpriteId } from '../model/ids.type';
import type { AnimationUser } from './animation-user.type';

const animationUsers = (artwork: Artwork, spriteId: SpriteId): readonly AnimationUser[] =>
  artwork.animations.flatMap((animation) => {
    const frames = animation.frames.filter((frame) => frame.spriteId === spriteId).length;
    return frames > 0 ? [{ animationId: animation.id, name: animation.name, frames }] : [];
  });

export { animationUsers };
