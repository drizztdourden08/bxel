/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { Tile } from '../model/tilemap.type';
import { findSprite } from './find-sprite';
import { flattenFrame } from './flatten-frame';

const tileSource = (artwork: Artwork, tile: Tile): Uint8Array | null => {
  const sprite = findSprite(artwork, tile.spriteId);
  const frame = sprite?.frames[0];
  return sprite && frame ? flattenFrame(sprite, frame.id) : null;
};

export { tileSource };
