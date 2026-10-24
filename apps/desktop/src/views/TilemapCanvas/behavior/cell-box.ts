/* @layer renderer-app @kind logic */
import type { Rect, Tileset } from '@bxel/document';

const cellBox = (cells: Rect, tileset: Tileset): Rect => ({
  x: cells.x * tileset.tileWidth,
  y: cells.y * tileset.tileHeight,
  width: cells.width * tileset.tileWidth,
  height: cells.height * tileset.tileHeight,
});

export { cellBox };
