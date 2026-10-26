/* @layer core @kind logic */
import type { AnimFrame, Animation } from '../model/animation.type';
import type { Pivot2 } from '../model/geometry.type';
import type { Artwork } from '../model/artwork.type';
import { findSprite } from './find-sprite';

const animFramePivot = (artwork: Artwork, animation: Animation, frame: AnimFrame): Pivot2 => {
  if (frame.pivot) return frame.pivot;
  if (frame.clip) return { x2: frame.clip.width, y2: frame.clip.height };
  const sprite = frame.spriteId === null ? undefined : findSprite(artwork, frame.spriteId);
  return sprite ? sprite.pivot : { x2: animation.width, y2: animation.height };
};

export { animFramePivot };
