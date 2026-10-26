/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import type { AnimFrame, Artwork } from '@bxel/document';
import type { FrameBadge } from './timeline.type';

const spriteBadge = (artwork: Artwork, frame: AnimFrame): FrameBadge => {
  const sprite = frame.spriteId === null ? undefined : findSprite(artwork, frame.spriteId);
  if (!sprite) return 'empty';
  return sprite.role === 'frame' ? 'owned' : 'shared';
};

const frameBadges = (artwork: Artwork, frame: AnimFrame): readonly FrameBadge[] => {
  const kind = spriteBadge(artwork, frame);
  return frame.clip ? [kind, 'clip'] : [kind];
};

export { frameBadges };
