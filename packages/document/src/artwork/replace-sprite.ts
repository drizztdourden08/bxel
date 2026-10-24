/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { Sprite } from '../model/sprite.type';

const replaceSprite = (artwork: Artwork, sprite: Sprite): Artwork => ({
  ...artwork,
  sprites: artwork.sprites.map((item) => (item.id === sprite.id ? sprite : item)),
});

export { replaceSprite };
