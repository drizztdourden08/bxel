/* @layer core @kind logic */
import type { TilemapExportInput } from './tilemap.type';

const tiledGridId = (input: TilemapExportInput, x: number, y: number): number => {
  const { tileset, tileWidth, tileHeight } = input;
  const column = (x - tileset.margin) / (tileWidth + tileset.spacing);
  const row = (y - tileset.margin) / (tileHeight + tileset.spacing);
  return row * tileset.columns + column;
};

export { tiledGridId };
