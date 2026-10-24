/* @layer core @kind logic */
import { clearColour } from './clear-colour';
import { cropTile } from './crop-tile';
import { shapeToCollision } from './shape-to-collision';
import { EMPTY_SHAPES } from './tiled.constants';
import type { PlannedTile, ResolvedTileset } from './tiled-plan.type';

const gridOf = (source: ResolvedTileset): { columns: number; count: number } => {
  const { tileset, image } = source;
  if (!image) return { columns: 0, count: 0 };
  const step = tileset.tileWidth + tileset.spacing;
  const columns = Math.floor((image.width - 2 * tileset.margin + tileset.spacing) / step);
  const rows = Math.floor((image.height - 2 * tileset.margin + tileset.spacing) / (tileset.tileHeight + tileset.spacing));
  const cells = Math.max(0, columns) * Math.max(0, rows);
  return { columns: Math.max(0, columns), count: tileset.tileCount > 0 ? Math.min(tileset.tileCount, cells) : cells };
};

const sheetTiles = (source: ResolvedTileset): PlannedTile[] => {
  const { tileset, image, firstGid } = source;
  const { columns, count } = gridOf(source);
  if (!image || columns === 0) return [];
  const info = new Map(tileset.tiles.map((tile) => [tile.id, tile] as const));
  return Array.from({ length: count }, (_, id) => {
    const x = tileset.margin + (id % columns) * (tileset.tileWidth + tileset.spacing);
    const y = tileset.margin + Math.floor(id / columns) * (tileset.tileHeight + tileset.spacing);
    const crop = cropTile(image, { x, y, width: tileset.tileWidth, height: tileset.tileHeight });
    const tile = info.get(id);
    return {
      gid: firstGid + id,
      image: clearColour(crop, tileset.image?.transparent ?? null),
      shapes: tile?.shapes ?? EMPTY_SHAPES,
      collision: shapeToCollision(tile?.shapes ?? EMPTY_SHAPES, { width: tileset.tileWidth, height: tileset.tileHeight }),
      properties: tile?.properties ?? {},
    };
  });
};

const collectionTiles = (source: ResolvedTileset): PlannedTile[] =>
  source.tileset.tiles.flatMap((tile) => {
    const image = source.tileImages.get(tile.id);
    const fits = image?.width === source.tileset.tileWidth && image.height === source.tileset.tileHeight;
    if (!image || !fits) return [];
    const collision = shapeToCollision(tile.shapes, { width: source.tileset.tileWidth, height: source.tileset.tileHeight });
    return [{ gid: source.firstGid + tile.id, image, shapes: tile.shapes, collision, properties: tile.properties }];
  });

const tilesetTiles = (source: ResolvedTileset): PlannedTile[] => (source.image ? sheetTiles(source) : collectionTiles(source));

export { tilesetTiles };
