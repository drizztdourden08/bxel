/* @layer core @kind logic */
import type { CellView } from './cell-mask.type';

const STEPS_4: readonly (readonly [number, number])[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const STEPS_8: readonly (readonly [number, number])[] = [...STEPS_4, [1, 1], [1, -1], [-1, 1], [-1, -1]];

const wandCells = (view: CellView, seed: { x: number; y: number }, connectivity: 4 | 8): Uint8Array => {
  const { columns, rows, cells } = view;
  const out = new Uint8Array(columns * rows);
  if (seed.x >= columns || seed.y >= rows) return out;
  const start = seed.y * columns + seed.x;
  const wanted = cells[start] ?? 0;
  const steps = connectivity === 8 ? STEPS_8 : STEPS_4;
  const stack = [start];
  for (let index = stack.pop(); index !== undefined; index = stack.pop()) {
    if (out[index] === 1 || (cells[index] ?? 0) !== wanted) continue;
    out[index] = 1;
    const x = index % columns;
    const y = (index - x) / columns;
    for (const [dx, dy] of steps) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < columns && ny < rows) stack.push(ny * columns + nx);
    }
  }
  return out;
};

export { wandCells };
