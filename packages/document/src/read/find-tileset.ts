/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { TilesetId } from '../model/ids.type';
import type { Tileset } from '../model/tilemap.type';

const findTileset = (artwork: Artwork, id: TilesetId): Tileset | undefined =>
  artwork.tilesets.find((tileset) => tileset.id === id);

export { findTileset };
