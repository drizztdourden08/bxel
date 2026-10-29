/* @layer renderer-app @kind logic */
import type { Point, Tilemap } from '@bxel/document';
import type { MapSelection } from '../stores/tilemap-store.type';
import { inBounds } from './in-bounds';

const selectionCells = (selection: MapSelection, tilemap: Tilemap): Point[] => {
  const { rect, mask } = selection;
  const cells: Point[] = [];
  for (let row = 0; row < rect.height; row += 1) {
    for (let column = 0; column < rect.width; column += 1) {
      const cell = { x: rect.x + column, y: rect.y + row };
      if ((mask === null || mask[row * rect.width + column] === 1) && inBounds(tilemap, cell)) cells.push(cell);
    }
  }
  return cells;
};

export { selectionCells };
