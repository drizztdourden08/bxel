/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { TilesetId } from '../model/ids.type';
import { findBank } from './find-bank';
import { findSprite } from './find-sprite';
import { frameToRgba } from './frame-to-rgba';
import { requireTileset } from './require-tileset';
import type { TileImage } from './tile-image.type';

const tilesetImages = (artwork: Artwork, tilesetId: TilesetId): readonly TileImage[] => {
  const tileset = requireTileset(artwork, tilesetId);
  const bank = findBank(artwork, tileset.bankId);
  const images: TileImage[] = [];
  for (const tile of tileset.tiles) {
    const sprite = findSprite(artwork, tile.spriteId);
    const frame = sprite?.frames[0];
    if (!sprite || !bank || !frame) continue;
    images.push({ key: tile.key, width: sprite.width, height: sprite.height, rgba: frameToRgba(sprite, bank, frame.id) });
  }
  return images;
};

export { tilesetImages };
