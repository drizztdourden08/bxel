/* @layer renderer-app @kind logic */
import type { Point, Tilemap } from '@bxel/document';

const clampCell = (cell: Point, tilemap: Tilemap): Point => ({
  x: Math.min(tilemap.columns - 1, Math.max(0, cell.x)),
  y: Math.min(tilemap.rows - 1, Math.max(0, cell.y)),
});

export { clampCell };
