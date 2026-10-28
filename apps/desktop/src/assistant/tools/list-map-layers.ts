/* @layer renderer-app @kind logic */
import { hiddenFailure } from '@bxel/mcp';
import type { Artwork, Tilemap, Tileset } from '@bxel/document';
import type { ToolHandler } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { reply } from './reply';
import type { ListMapLayersInput } from './tool-input.type';
import { viewFor } from './view-for';

const tilemapEntry = (map: Tilemap) => ({
  tilemapId: map.id,
  name: map.name,
  tilesetId: map.tilesetId,
  columns: map.columns,
  rows: map.rows,
  orientation: map.orientation?.kind ?? ('orthogonal' as const),
  layers: map.layers.map((layer) => ({
    layerId: layer.id,
    name: layer.name,
    visible: layer.visible,
    locked: layer.locked,
    ...(layer.colour === undefined ? {} : { colour: layer.colour }),
  })),
});

const tilesetEntry = (tileset: Tileset, includeTiles: boolean) => ({
  tilesetId: tileset.id,
  name: tileset.name,
  tileWidth: tileset.tileWidth,
  tileHeight: tileset.tileHeight,
  tileCount: tileset.tiles.length,
  terrain: tileset.terrain?.kind ?? null,
  tiles: includeTiles ? tileset.tiles.map((tile) => ({ key: tile.key, spriteId: tile.spriteId, collision: tile.collision?.kind ?? null, animation: tile.animation ?? null })) : [],
});

const visibleMaps = (artwork: Artwork, hidden: ReadonlySet<string>, wanted: string | undefined): Tilemap[] =>
  artwork.tilemaps.filter((map) => !hidden.has(map.id) && !hidden.has(map.tilesetId) && (wanted === undefined || map.id === wanted));

const listMapLayers: ToolHandler = (input, context) => {
  const { documentId, tilemapId, includeTiles } = input as ListMapLayersInput;
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  const { artwork, revision } = view.state;
  const maps = visibleMaps(artwork, hiddenAssets(context, documentId), tilemapId);
  const used = new Set(maps.map((map) => map.tilesetId));
  return reply({
    ok: true,
    revision,
    tilemaps: maps.map(tilemapEntry),
    tilesets: artwork.tilesets.filter((tileset) => used.has(tileset.id)).map((tileset) => tilesetEntry(tileset, includeTiles)),
  });
};

export { listMapLayers };
