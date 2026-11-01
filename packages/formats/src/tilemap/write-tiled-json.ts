/* @layer core @kind logic */
import { checkTilemapInput } from './check-tilemap-input';
import { tiledLayers } from './tiled-layers';
import { tiledOrientation } from './tiled-orientation';
import { tiledTileEntries } from './tiled-tile-entries';
import { TILED_JSON } from './tilemap.constants';
import type { TilemapExportInput, TilemapJsonResult } from './tilemap.type';

const objectCount = (entries: readonly Record<string, unknown>[]): number =>
  entries.reduce((sum, entry) => sum + ((entry['objectgroup'] as { objects?: readonly unknown[] } | undefined)?.objects?.length ?? 0), 0);

const writeTiledJson = (input: TilemapExportInput): TilemapJsonResult => {
  const invalid = checkTilemapInput(input);
  if (invalid) return invalid;
  const { tileset } = input;
  const { layers, count } = tiledLayers(input);
  const shaped = tiledTileEntries(input);
  const map = {
    type: 'map',
    version: TILED_JSON.VERSION,
    tiledversion: TILED_JSON.TILED_VERSION,
    ...tiledOrientation(input),
    infinite: false,
    compressionlevel: -1,
    width: input.columns,
    height: input.rows,
    tilewidth: input.tileWidth,
    tileheight: input.tileHeight,
    nextlayerid: count + 1,
    nextobjectid: Math.max(shaped.length, objectCount(shaped)) + 1,
    layers,
    tilesets: [
      {
        firstgid: TILED_JSON.FIRST_GID,
        name: tileset.name,
        image: tileset.image,
        imagewidth: tileset.imageWidth,
        imageheight: tileset.imageHeight,
        tilewidth: input.tileWidth,
        tileheight: input.tileHeight,
        tilecount: tileset.tiles.length,
        columns: tileset.columns,
        spacing: tileset.spacing,
        margin: tileset.margin,
        ...(shaped.length > 0 ? { tiles: shaped } : {}),
      },
    ],
  };
  return { ok: true, json: `${JSON.stringify(map, null, 2)}\n` };
};

export { writeTiledJson };
