/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';

const tileOwners = (artwork: Artwork): ReadonlyMap<string, string> =>
  new Map(artwork.tilesets.flatMap((tileset) => tileset.tiles.map((tile) => [tile.spriteId, tileset.id] as const)));

export { tileOwners };
