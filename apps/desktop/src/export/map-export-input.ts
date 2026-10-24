/* @layer renderer-app @kind logic */
import type { Tilemap, Tileset } from '@bxel/document';
import type { TilemapExportInput, TilesetImage } from '@bxel/formats';
import { MAP_EXPORT } from './map-export.constants';

const mapExportInput = (tilemap: Tilemap, tileset: Tileset, sheet: TilesetImage, imageName: string): TilemapExportInput => ({
  name: tilemap.name,
  columns: tilemap.columns,
  rows: tilemap.rows,
  tileWidth: tileset.tileWidth,
  tileHeight: tileset.tileHeight,
  tileset: {
    name: tileset.name,
    image: imageName,
    imageWidth: sheet.image.width,
    imageHeight: sheet.image.height,
    columns: sheet.columns,
    spacing: MAP_EXPORT.spacing,
    margin: MAP_EXPORT.margin,
    tiles: sheet.tiles,
  },
  layers: tilemap.layers.map((layer) => ({ name: layer.name, visible: layer.visible, locked: layer.locked, cells: layer.cells })),
});

export { mapExportInput };
