/* @layer core @kind logic */
import type { SpriteId } from '../model/ids.type';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const removeSprites = (draft: Draft, ids: ReadonlySet<SpriteId>): void => {
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    sprites: artwork.sprites.filter((sprite) => !ids.has(sprite.id)),
    coverSpriteId: artwork.coverSpriteId !== null && ids.has(artwork.coverSpriteId) ? null : artwork.coverSpriteId,
  }));
};

export { removeSprites };
