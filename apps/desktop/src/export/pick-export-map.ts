/* @layer renderer-app @kind logic */
import { findTileset } from '@bxel/document';
import type { Artwork, TilemapId } from '@bxel/document';
import type { MapPick } from './export.type';
import { MAP_EXPORT_TEXT } from './map-export.constants';

const pickExportMap = (artwork: Artwork, wanted: TilemapId | null | undefined): MapPick | string => {
  const tilemap = artwork.tilemaps.find((each) => each.id === wanted) ?? artwork.tilemaps[0];
  if (!tilemap) return MAP_EXPORT_TEXT.noMap;
  const tileset = findTileset(artwork, tilemap.tilesetId);
  if (!tileset) return MAP_EXPORT_TEXT.noTileset;
  return tileset.tiles.length === 0 ? MAP_EXPORT_TEXT.noTiles : { tilemap, tileset };
};

export { pickExportMap };
