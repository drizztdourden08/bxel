/* @layer renderer-app @kind constants */
import type { MapFormat } from './export.type';

const MAP_EXPORT = {
  columns: 8,
  spacing: 0,
  margin: 0,
  suffix: '-tiles',
  extensions: { bxel: 'json', tiled: 'tmj' } satisfies Record<MapFormat, string>,
} as const;

const MAP_EXPORT_TEXT = {
  noMap: 'This file has no tilemap to export.',
  noTileset: 'The tilemap has no tileset to export.',
  noTiles: 'The tileset has no tiles to export. Add a tile first.',
  tilesDetail: (name: string, width: number, height: number, count: number): string =>
    `${name}, ${width} x ${height} px, ${count} ${count === 1 ? 'tile' : 'tiles'}`,
  mapDetail: (name: string, columns: number, rows: number, layers: number): string =>
    `${name}, ${columns} x ${rows} cells, ${layers} ${layers === 1 ? 'layer' : 'layers'}`,
  bxelNote: 'The Bxel map JSON lists the tile key and the flip and turn bits of every cell.',
  tiledNote: 'The Tiled JSON uses global tile ids with the flip bits in the top three bits.',
} as const;

export { MAP_EXPORT, MAP_EXPORT_TEXT };
