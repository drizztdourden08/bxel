/* @layer renderer-app @kind logic */
import { solidShape, tileMeta, tileShapes } from '@bxel/document';
import type { Tile } from '@bxel/document';
import type { TilemapExportInput, TilesetEntry } from '@bxel/formats';
import type { MapPick } from './export.type';
import type { TileHeld } from './export-parts.type';
import { MAP_EXPORT } from './map-export.constants';

const plainShape = (tile: Tile): Pick<TilesetEntry, 'collision'> => {
  const solid = solidShape(tile);
  if (!solid) return {};
  const { layer: _layer, oneWay: _oneWay, ...shape } = solid;
  return { collision: shape };
};

const entryOf = (placement: { key: number; x: number; y: number }, tile: Tile | undefined): TilesetEntry => {
  if (!tile) return placement;
  return {
    ...placement,
    ...plainShape(tile),
    ...(tileShapes(tile).length > 0 ? { shapes: tileShapes(tile) } : {}),
    ...tileMeta(tile),
  };
};

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
    ...(tileset.terrainSets ? { terrainSets: tileset.terrainSets } : {}),
    ...(tileset.fields ? { fields: tileset.fields } : {}),
    ...(held.animations.length > 0 ? { animations: held.animations } : {}),
    tiles: held.sheet.tiles.map((placement) => entryOf(placement, tileset.tiles.find((tile) => tile.key === placement.key))),
  },
  layers: tilemap.layers.map((layer) => ({
    id: layer.id,
    name: layer.name,
    visible: layer.visible,
    locked: layer.locked,
    ...(layer.opacity === undefined ? {} : { opacity: layer.opacity }),
    ...(layer.kind === 'group' ? { group: true } : {}),
    ...(layer.parentId ? { parentId: layer.parentId } : {}),
    cells: layer.cells,
  })),
});

export { mapExportInput };
