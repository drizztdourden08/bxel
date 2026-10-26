/* @layer renderer-app @kind logic */
import type { TilemapExportInput } from '@bxel/formats';
import type { MapPick } from './export.type';
import type { TileHeld } from './export-parts.type';
import { MAP_EXPORT } from './map-export.constants';

const mapExportInput = ({ tilemap, tileset }: MapPick, held: TileHeld): TilemapExportInput => ({
  name: tilemap.name,
  columns: tilemap.columns,
  rows: tilemap.rows,
  tileWidth: tileset.tileWidth,
  tileHeight: tileset.tileHeight,
  ...(tilemap.orientation ? { orientation: tilemap.orientation } : {}),
  tileset: {
    name: tileset.name,
    image: held.imageName,
    imageWidth: held.sheet.image.width,
    imageHeight: held.sheet.image.height,
    columns: held.sheet.columns,
    spacing: MAP_EXPORT.spacing,
    margin: MAP_EXPORT.margin,
    ...(tileset.terrain ? { terrain: tileset.terrain } : {}),
    ...(held.animations.length > 0 ? { animations: held.animations } : {}),
    tiles: held.sheet.tiles.map((placement) => {
      const collision = tileset.tiles.find((tile) => tile.key === placement.key)?.collision;
      return collision ? { ...placement, collision } : placement;
    }),
  },
  layers: tilemap.layers.map((layer) => ({ name: layer.name, visible: layer.visible, locked: layer.locked, cells: layer.cells })),
});

export { mapExportInput };
