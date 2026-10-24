/* @layer renderer-app @kind logic */
import type { Rect, Tilemap } from '@bxel/document';
import type { TileStamp } from '../stores/tilemap-store.type';
import { inBounds } from './in-bounds';
import { rectCells } from './rect-cells';
import type { Placement } from './tilemap.type';

const patternPlacements = (stamp: TileStamp, rect: Rect, filled: boolean, tilemap: Tilemap): Placement[] =>
  rectCells(rect, filled)
    .filter((cell) => inBounds(tilemap, cell))
    .map((cell) => {
      const column = (cell.x - rect.x) % stamp.columns;
      const row = (cell.y - rect.y) % stamp.rows;
      return { cell, key: stamp.keys[row * stamp.columns + column] ?? 0 };
    })
    .filter((placement) => placement.key !== 0);

export { patternPlacements };
