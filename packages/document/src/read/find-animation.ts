/* @layer core @kind logic */
import type { Animation } from '../model/animation.type';
import type { Artwork } from '../model/artwork.type';
import type { AnimationId } from '../model/ids.type';

const findAnimation = (artwork: Artwork, id: AnimationId): Animation | undefined =>
  artwork.animations.find((animation) => animation.id === id);

export { findAnimation };
