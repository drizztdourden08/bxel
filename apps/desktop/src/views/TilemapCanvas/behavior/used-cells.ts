/* @layer renderer-app @kind logic */
import { cellKey } from '@bxel/document';
import type { Point, Tilemap } from '@bxel/document';
import { USES_CELL_CAP } from '../TilemapCanvas.constants';

const usedCells = (tilemap: Tilemap, key: number): Point[] => {
  const found = new Map<number, Point>();
  for (const layer of tilemap.layers) {
    if (!layer.visible) continue;
    for (let index = 0; index < layer.cells.length && found.size < USES_CELL_CAP; index += 1) {
      const cell = layer.cells[index];
      if (cell !== undefined && cellKey(cell) === key) found.set(index, { x: index % tilemap.columns, y: Math.floor(index / tilemap.columns) });
    }
  }
  return [...found.values()];
};

export { usedCells };
