/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { Tile, Tileset } from '../model/tilemap.type';
import { animationSequence } from './animation-sequence';
import { composeAnimationFrame } from './compose-animation-frame';
import { findAnimation } from './find-animation';
import { tileAnimationIssue } from './tile-animation-issue';
import type { TilePlayback } from './tile-playback.type';

const tilePlayback = (artwork: Artwork, tileset: Tileset, tile: Tile): TilePlayback | null => {
  const link = tile.animation;
  if (!link || tileAnimationIssue(artwork, tileset, tile) !== null) return null;
  const animation = findAnimation(artwork, link.animationId);
  if (!animation) return null;
  const { steps, cycleMs } = animationSequence(animation, link.tagId);
  if (steps.length === 0 || cycleMs <= 0) return null;
  let total = 0;
  const ends = steps.map((step) => {
    total += step.durationMs;
    return total;
  });
  return {
    frames: steps.map((step) => composeAnimationFrame(artwork, animation, step.frameId, step.flip)),
    ends,
    cycleMs,
    start: link.start,
  };
};

export { tilePlayback };
