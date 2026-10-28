/* @layer renderer-app @kind logic */
import type { Artwork, SpriteId } from '@bxel/document';
import type { SpriteUse } from './sprite-usage.type';

const spriteUsage = (artwork: Artwork, spriteId: SpriteId): SpriteUse[] =>
  artwork.animations.flatMap((animation) => {
    const frames = animation.frames.flatMap((frame, index) => (frame.spriteId === spriteId ? [{ id: frame.id, number: index + 1 }] : []));
    return frames.length === 0 ? [] : [{ animationId: animation.id, name: animation.name, frames }];
  });

export { spriteUsage };
