/* @layer renderer-app @kind logic */
import type { Tilemap, TilemapId } from '@bxel/document';
import { findTilemap } from '@bxel/document';
import type { Artwork } from '@bxel/document';

const mapFor = (artwork: Artwork, tilemapId: string, hidden: ReadonlySet<string>): Tilemap | undefined => {
  const map = findTilemap(artwork, tilemapId as TilemapId);
  return map && !hidden.has(map.id) && !hidden.has(map.tilesetId) ? map : undefined;
};

export { mapFor };
