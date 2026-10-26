/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import type { AnimFrame, Artwork } from '@bxel/document';
import type { FrameBadge } from './timeline.type';

const frameBadges = (artwork: Artwork, frame: AnimFrame): readonly FrameBadge[] => {
  const sprite = frame.spriteId === null ? undefined : findSprite(artwork, frame.spriteId);
  const kind: FrameBadge = !sprite ? 'empty' : sprite.role === 'frame' ? 'owned' : 'shared';
  return frame.clip ? [kind, 'clip'] : [kind];
};

export { frameBadges };
