/* @layer core @kind logic */
import { cellKey } from './cell-key';
import type { CellView } from './cell-mask.type';

const tileCells = (view: CellView, key: number): Uint8Array => {
  const out = new Uint8Array(view.columns * view.rows);
  view.cells.forEach((cell, index) => {
    if (cellKey(cell) === key) out[index] = 1;
  });
  return out;
};

export { tileCells };
