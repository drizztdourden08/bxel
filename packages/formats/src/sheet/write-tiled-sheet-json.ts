/* @layer core @kind logic */
import { TILED_JSON } from '../tilemap/tilemap.constants';
import type { JsonValue, SheetFrameEntry, SheetMetadata, SheetSpriteEntry } from './sheet-metadata.type';
import { tagPlayOrder } from './tag-play-order';
import type { TiledSheetGrid } from './tiled-sheet-grid.type';
import type { TagRun as Run, TileEntry } from './write-tiled-sheet-json.type';

const countOf = (extent: number, size: number, grid: TiledSheetGrid): number =>
  Math.floor((extent - 2 * grid.margin + grid.spacing) / (size + grid.spacing));

const tileIdOf = (frame: SheetFrameEntry, grid: TiledSheetGrid, columns: number): number => {
  const column = (frame.box.x - grid.margin) / (grid.tileWidth + grid.spacing);
  const row = (frame.box.y - grid.margin) / (grid.tileHeight + grid.spacing);
  return row * columns + column;
};

const runsOf = (sprite: SheetSpriteEntry): Run[] => {
  if (sprite.tags.length > 0) {
    return sprite.tags.map((tag) => ({ name: tag.name, tag, order: tagPlayOrder(tag.from, tag.to, tag.direction) }));
  }
  return sprite.frames.length > 1 ? [{ name: sprite.name, tag: null, order: sprite.frames.map((_frame, index) => index) }] : [];
};

const propertiesOf = (sprite: SheetSpriteEntry, run: Run): JsonValue[] => [
  { name: 'bxelSprite', type: 'string', value: sprite.name },
  { name: 'bxelTag', type: 'string', value: run.name },
  ...(run.tag && run.tag.repeat > 0 ? [{ name: 'bxelRepeat', type: 'int', value: run.tag.repeat }] : []),
  ...(run.tag?.facing === undefined ? [] : [{ name: 'bxelFacing', type: 'string', value: run.tag.facing }]),
];

const entryOf = (sprite: SheetSpriteEntry, run: Run, grid: TiledSheetGrid, columns: number): TileEntry | null => {
  const frames = run.order.flatMap((index) => sprite.frames[index] ?? []);
  const first = frames[0];
  if (!first) return null;
  const id = tileIdOf(first, grid, columns);
  const animation = frames.map((frame) => ({ tileid: tileIdOf(frame, grid, columns), duration: frame.durationMs }));
  return { id, json: { id, animation, properties: propertiesOf(sprite, run) } };
};

const tilesJson = (metadata: SheetMetadata, grid: TiledSheetGrid, columns: number): JsonValue[] => {
  const entries = new Map<number, JsonValue>();
  for (const sprite of metadata.sprites) {
    for (const run of runsOf(sprite)) {
      const entry = entryOf(sprite, run, grid, columns);
      if (entry && !entries.has(entry.id)) entries.set(entry.id, entry.json);
    }
  }
  return [...entries.entries()].sort(([a], [b]) => a - b).map(([, json]) => json);
};

const writeTiledSheetJson = (metadata: SheetMetadata, grid: TiledSheetGrid, name: string): string => {
  const columns = countOf(metadata.width, grid.tileWidth, grid);
  const rows = countOf(metadata.height, grid.tileHeight, grid);
  const tiles = tilesJson(metadata, grid, columns);
  const tileset = {
    type: 'tileset',
    version: TILED_JSON.VERSION,
    tiledversion: TILED_JSON.TILED_VERSION,
    name,
    image: metadata.image,
    imagewidth: metadata.width,
    imageheight: metadata.height,
    tilewidth: grid.tileWidth,
    tileheight: grid.tileHeight,
    tilecount: columns * rows,
    columns,
    spacing: grid.spacing,
    margin: grid.margin,
    ...(tiles.length > 0 ? { tiles } : {}),
  };
  return `${JSON.stringify(tileset, null, 2)}\n`;
};

export { writeTiledSheetJson };
