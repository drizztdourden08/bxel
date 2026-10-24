/* @layer core @kind logic */
import { CELL_BITS, TILED_JSON } from './tilemap.constants';
import type { TilemapExportInput } from './tilemap.type';

const gridId = (input: TilemapExportInput, x: number, y: number): number => {
  const { tileset, tileWidth, tileHeight } = input;
  const column = (x - tileset.margin) / (tileWidth + tileset.spacing);
  const row = (y - tileset.margin) / (tileHeight + tileset.spacing);
  return row * tileset.columns + column;
};

const tiledGids = (input: TilemapExportInput, cells: Uint32Array): number[] => {
  const ids = new Map(input.tileset.tiles.map((tile) => [tile.key, gridId(input, tile.x, tile.y)]));
  return Array.from(cells, (cell) => {
    const id = ids.get(cell & CELL_BITS.KEY_MASK);
    return id === undefined ? 0 : ((TILED_JSON.FIRST_GID + id) | (cell & CELL_BITS.FLAG_MASK)) >>> 0;
  });
};

export { tiledGids };
