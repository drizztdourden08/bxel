/* @layer renderer-app @kind logic */
import type { Point, Tileset } from '@bxel/document';

const cellOf = (at: Point, tileset: Tileset): Point => ({
  x: Math.floor(at.x / tileset.tileWidth),
  y: Math.floor(at.y / tileset.tileHeight),
});

export { cellOf };
