/* @layer core @kind logic */
import type { Animation } from '../model/animation.type';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const addAnimation = (draft: Draft, animation: Animation): void => {
  updateArtwork(draft, (artwork) => ({ ...artwork, animations: [...artwork.animations, animation] }));
};

export { addAnimation };
