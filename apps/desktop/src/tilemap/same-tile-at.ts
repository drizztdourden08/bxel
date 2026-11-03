/* @layer renderer-app @kind logic */
import { cellKey } from '@bxel/document';
import type { Point, Tilemap } from '@bxel/document';

const sameTileAt = (tilemap: Tilemap, key: number, at: Point): boolean => {
  if (at.x < 0 || at.y < 0 || at.x >= tilemap.columns || at.y >= tilemap.rows) return false;
  const index = at.y * tilemap.columns + at.x;
  return tilemap.layers.some((layer) => {
    const cell = layer.cells[index];
    return layer.visible && cell !== undefined && cellKey(cell) === key;
  });
};

export { sameTileAt };
