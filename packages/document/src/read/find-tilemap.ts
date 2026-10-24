/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { TilemapId } from '../model/ids.type';
import type { Tilemap } from '../model/tilemap.type';

const findTilemap = (artwork: Artwork, id: TilemapId): Tilemap | undefined =>
  artwork.tilemaps.find((tilemap) => tilemap.id === id);

export { findTilemap };
