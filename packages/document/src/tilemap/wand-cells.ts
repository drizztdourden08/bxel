/* @layer core @kind logic */
import type { CellView } from './cell-mask.type';
import { STEPS_4, STEPS_8 } from './wand-cells.constants';

const neighbours = (view: CellView, index: number, steps: readonly (readonly [number, number])[]): number[] => {
  const x = index % view.columns;
  const y = (index - x) / view.columns;
  const found: number[] = [];
  for (const [dx, dy] of steps) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && ny >= 0 && nx < view.columns && ny < view.rows) found.push(ny * view.columns + nx);
  }
  return found;
};

const wandCells = (view: CellView, seed: { x: number; y: number }, connectivity: 4 | 8): Uint8Array => {
  const out = new Uint8Array(view.columns * view.rows);
  if (seed.x >= view.columns || seed.y >= view.rows) return out;
  const start = seed.y * view.columns + seed.x;
  const wanted = view.cells[start] ?? 0;
  const steps = connectivity === 8 ? STEPS_8 : STEPS_4;
  const stack = [start];
  for (let index = stack.pop(); index !== undefined; index = stack.pop()) {
    if (out[index] === 1 || (view.cells[index] ?? 0) !== wanted) continue;
    out[index] = 1;
    stack.push(...neighbours(view, index, steps));
  }
  return out;
};

export { wandCells };
