/* @layer core @kind logic */
import { checkTilemapInput } from './check-tilemap-input';
import { tiledGids } from './tiled-gids';
import { TILED_JSON } from './tilemap.constants';
import type { TilemapExportInput, TilemapJsonResult } from './tilemap.type';

const writeTiledJson = (input: TilemapExportInput): TilemapJsonResult => {
  const invalid = checkTilemapInput(input);
  if (invalid) return invalid;
  const { tileset } = input;
  const layers = input.layers.map((layer, index) => ({
    id: index + 1,
    name: layer.name,
    type: 'tilelayer',
    visible: layer.visible,
    locked: layer.locked,
    opacity: 1,
    x: 0,
    y: 0,
    width: input.columns,
    height: input.rows,
    data: tiledGids(input, layer.cells),
  }));
  const map = {
    type: 'map',
    version: TILED_JSON.VERSION,
    tiledversion: TILED_JSON.TILED_VERSION,
    orientation: 'orthogonal',
    renderorder: 'right-down',
    infinite: false,
    compressionlevel: -1,
    width: input.columns,
    height: input.rows,
    tilewidth: input.tileWidth,
    tileheight: input.tileHeight,
    nextlayerid: layers.length + 1,
    nextobjectid: 1,
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
      },
    ],
  };
  return { ok: true, json: `${JSON.stringify(map, null, 2)}\n` };
};

export { writeTiledJson };
