/* @layer renderer-app @kind constants */
import { defineDragType } from '@drizztdourden08/brock-react';
import type { TileDragPayload } from './tile-drag.type';

const TILE_DRAG = defineDragType<TileDragPayload>('bxel.tile');

const TILE_DROP_TEXT = {
  noTileset: 'Open a tileset first, then drop here.',
  wrongSize: (width: number, height: number, tileWidth: number, tileHeight: number): string =>
    `This is ${width} by ${height} pixels. Tiles of this set are ${tileWidth} by ${tileHeight}, so drop a whole number of them.`,
  wrongPalette: 'This uses another palette than the tileset. Give them one palette first.',
  noSprites: 'Drop sprites or an image here to add tiles.',
  added: (count: number): string => (count === 1 ? 'Added 1 tile.' : `Added ${count} tiles.`),
  label: (count: number): string => (count === 1 ? 'Add a tile from a drop' : `Add ${count} tiles from a drop`),
  tooMany: (limit: number): string => `That is more than ${limit} tiles at once. Drop a smaller image.`,
  empty: 'That image has no pixels to make a tile from.',
} as const;

const TILE_DROP_LIMIT = 256;

const TILE_DROP_REF = 'droptile';

export { TILE_DRAG, TILE_DROP_LIMIT, TILE_DROP_REF, TILE_DROP_TEXT };
