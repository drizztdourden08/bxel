/* @layer core @kind logic */
import { cellFlagBits } from './cell-flag-bits';
import { checkTilemapInput } from './check-tilemap-input';
import { CELL_BITS, TILEMAP_JSON } from './tilemap.constants';
import type { TilemapExportInput, TilemapJsonResult, TilemapLayerInput } from './tilemap.type';

const layerLine = (layer: TilemapLayerInput): string =>
  `    ${JSON.stringify({
    name: layer.name,
    visible: layer.visible,
    locked: layer.locked,
    keys: Array.from(layer.cells, (cell) => cell & CELL_BITS.KEY_MASK),
    flags: Array.from(layer.cells, cellFlagBits),
  })}`;

const writeTilemapJson = (input: TilemapExportInput): TilemapJsonResult => {
  const invalid = checkTilemapInput(input);
  if (invalid) return invalid;
  const { tileset } = input;
  const head = JSON.stringify(
    {
      format: TILEMAP_JSON.FORMAT,
      version: TILEMAP_JSON.VERSION,
      name: input.name,
      size: { columns: input.columns, rows: input.rows },
      tileSize: { w: input.tileWidth, h: input.tileHeight },
      flagBits: TILEMAP_JSON.FLAG_BITS,
      tileset: {
        name: tileset.name,
        image: tileset.image,
        size: { w: tileset.imageWidth, h: tileset.imageHeight },
        columns: tileset.columns,
        spacing: tileset.spacing,
        margin: tileset.margin,
        tiles: tileset.tiles,
      },
    },
    null,
    2,
  );
  const layers = input.layers.map(layerLine).join(',\n');
  return { ok: true, json: `${head.slice(0, -2)},\n  "layers": [\n${layers}\n  ]\n}\n` };
};

export { writeTilemapJson };
