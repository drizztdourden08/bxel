/* @layer core @kind logic */
import { tiledGridId } from './tiled-grid-id';
import { CELL_BITS, TILED_JSON } from './tilemap.constants';
import type { TilemapExportInput } from './tilemap.type';

const tiledGids = (input: TilemapExportInput, cells: Uint32Array): number[] => {
  const ids = new Map(input.tileset.tiles.map((tile) => [tile.key, tiledGridId(input, tile.x, tile.y)]));
  return Array.from(cells, (cell) => {
    const id = ids.get(cell & CELL_BITS.KEY_MASK);
    return id === undefined ? 0 : ((TILED_JSON.FIRST_GID + id) | (cell & CELL_BITS.FLAG_MASK)) >>> 0;
  });
};

export { tiledGids };
