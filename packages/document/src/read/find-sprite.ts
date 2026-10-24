/* @layer core @kind logic */
import type { SpriteId } from '../model/ids.type';
import type { Artwork } from '../model/artwork.type';
import type { Sprite } from '../model/sprite.type';

const findSprite = (artwork: Artwork, id: SpriteId): Sprite | undefined =>
  artwork.sprites.find((sprite) => sprite.id === id);

export { findSprite };
