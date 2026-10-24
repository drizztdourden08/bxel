/* @layer core @kind logic */
import type { SpriteId } from '../model/ids.type';
import type { Sprite } from '../model/sprite.type';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const insertSprite = (draft: Draft, sprite: Sprite, after: SpriteId): void => {
  updateArtwork(draft, (artwork) => {
    const at = artwork.sprites.findIndex((item) => item.id === after) + 1;
    return { ...artwork, sprites: [...artwork.sprites.slice(0, at), sprite, ...artwork.sprites.slice(at)] };
  });
};

export { insertSprite };
