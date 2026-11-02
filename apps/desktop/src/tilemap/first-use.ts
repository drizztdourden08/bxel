/* @layer renderer-app @kind logic */
import { cellKey } from '@bxel/document';
import type { Point, Tilemap } from '@bxel/document';

const firstUse = (tilemap: Tilemap, key: number): Point | null => {
  for (const layer of tilemap.layers) {
    if (!layer.visible) continue;
    const index = layer.cells.findIndex((cell) => cellKey(cell) === key);
    if (index >= 0) return { x: index % tilemap.columns, y: Math.floor(index / tilemap.columns) };
  }
  return null;
};

export { firstUse };
