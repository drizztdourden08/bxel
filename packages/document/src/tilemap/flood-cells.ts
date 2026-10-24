/* @layer core @kind logic */
import { cellKey } from './cell-key';
import type { Grid } from './grid.type';

const neighbours = (index: number, grid: Grid): number[] => {
  const x = index % grid.columns;
  const found: number[] = [];
  if (x > 0) found.push(index - 1);
  if (x < grid.columns - 1) found.push(index + 1);
  if (index >= grid.columns) found.push(index - grid.columns);
  if (index < (grid.rows - 1) * grid.columns) found.push(index + grid.columns);
  return found;
};

const floodCells = (cells: Uint32Array, grid: Grid, seed: number, value: number): void => {
  const target = cellKey(cells[seed] ?? 0);
  const visited = new Uint8Array(cells.length);
  const stack = [seed];
  for (let index = stack.pop(); index !== undefined; index = stack.pop()) {
    if (visited[index] === 1 || cellKey(cells[index] ?? 0) !== target) continue;
    visited[index] = 1;
    cells[index] = value;
    stack.push(...neighbours(index, grid));
  }
};

export { floodCells };
