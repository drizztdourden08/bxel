/* @layer core @kind logic */
import type { Sprite } from '../model/sprite.type';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const addSprite = (draft: Draft, sprite: Sprite): void => {
  updateArtwork(draft, (artwork) => ({ ...artwork, sprites: [...artwork.sprites, sprite] }));
};

export { addSprite };
