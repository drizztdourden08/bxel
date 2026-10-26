/* @layer core @kind logic */
import type { Animation } from '../model/animation.type';
import type { AnimationId } from '../model/ids.type';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const updateAnimation = (draft: Draft, id: AnimationId, change: (animation: Animation) => Animation): void => {
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    animations: artwork.animations.map((animation) => (animation.id === id ? change(animation) : animation)),
  }));
};

export { updateAnimation };
