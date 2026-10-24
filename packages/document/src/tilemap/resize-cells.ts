/* @layer core @kind logic */
import type { Point } from '../model/geometry.type';
import type { Grid } from './grid.type';

const resizeCells = (cells: Uint32Array, from: Grid, to: Grid, offset: Point): Uint32Array => {
  const out = new Uint32Array(to.columns * to.rows);
  const start = Math.max(0, offset.x);
  const end = Math.min(to.columns, offset.x + from.columns);
  if (end <= start) return out;
  for (let y = Math.max(0, offset.y); y < Math.min(to.rows, offset.y + from.rows); y += 1) {
    const row = (y - offset.y) * from.columns - offset.x;
    out.set(cells.subarray(row + start, row + end), y * to.columns + start);
  }
  return out;
};

export { resizeCells };
