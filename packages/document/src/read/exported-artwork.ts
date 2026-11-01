/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import { exportedSprite } from './exported-sprite';

const exportedArtwork = (artwork: Artwork): Artwork => {
  const sprites = artwork.sprites.map(exportedSprite);
  return sprites.every((sprite, index) => sprite === artwork.sprites[index]) ? artwork : { ...artwork, sprites };
};

export { exportedArtwork };
