/* @layer core @kind logic */
import type { Point } from '../../model/geometry.type';
import { MAX_STROKE_CELLS } from '../../model/tilemap-limits.constants';
import type { Tilemap } from '../../model/tilemap.type';
import { lineCells } from '../../tilemap/line-cells';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const inside = (tilemap: Tilemap, point: Point): boolean =>
  point.x >= 0 && point.y >= 0 && point.x < tilemap.columns && point.y < tilemap.rows;

const strokeIndexes = (tilemap: Tilemap, points: readonly Point[]): number[] => {
  const indexes: number[] = [];
  let steps = 0;
  let previous = points[0];
  for (const point of points) {
    const from = previous ?? point;
    steps += Math.max(Math.abs(point.x - from.x), Math.abs(point.y - from.y)) + 1;
    if (steps > MAX_STROKE_CELLS) throw fail(ERROR_CODE.BATCH_TOO_LARGE, 'The stroke covers too many cells.', { path: 'options.points' });
    for (const cell of lineCells(from, point)) {
      if (inside(tilemap, cell)) indexes.push(cell.y * tilemap.columns + cell.x);
    }
    previous = point;
  }
  return indexes;
};

export { strokeIndexes };
