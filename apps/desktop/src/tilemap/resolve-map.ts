/* @layer renderer-app @kind logic */
import { findTileset } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { tileLayerOf } from './tile-layer-of';
import type { MapContext, MapPicks } from './tilemap.type';

const resolveMap = (artwork: Artwork, picks: MapPicks): MapContext => {
  const tilemap = artwork.tilemaps.find((each) => each.id === picks.mapId) ?? artwork.tilemaps[0] ?? null;
  const tileset = tilemap
    ? (findTileset(artwork, tilemap.tilesetId) ?? null)
    : (artwork.tilesets.find((each) => each.id === picks.tilesetId) ?? artwork.tilesets[0] ?? null);
  const layer = tilemap ? tileLayerOf(tilemap.layers, picks.layerId ?? null) : null;
  return { artwork, tileset, tilemap, layer };
};

export { resolveMap };
