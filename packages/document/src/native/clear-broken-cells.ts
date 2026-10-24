/* @layer core @kind logic */
import { cellKey } from '../tilemap/cell-key';

const clearBrokenCells = (cells: Uint32Array, keys: ReadonlySet<number>): readonly number[] => {
  const lost: number[] = [];
  for (const [index, cell] of cells.entries()) {
    const key = cellKey(cell);
    if (key === 0 || keys.has(key)) continue;
    lost.push(key);
    cells[index] = 0;
  }
  return lost;
};

export { clearBrokenCells };
