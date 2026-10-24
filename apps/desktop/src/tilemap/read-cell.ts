/* @layer renderer-app @kind logic */
import { cellKey, readCellFlags } from '@bxel/document';
import type { MapLayer, Point, Tilemap } from '@bxel/document';
import { inBounds } from './in-bounds';
import type { CellRead } from './tilemap.type';

const read = (cell: number): CellRead => ({ key: cellKey(cell), flags: readCellFlags(cell) });

const readCell = (tilemap: Tilemap, layer: MapLayer, at: Point): CellRead | null =>
  inBounds(tilemap, at) ? read(layer.cells[at.y * tilemap.columns + at.x] ?? 0) : null;

export { readCell };
