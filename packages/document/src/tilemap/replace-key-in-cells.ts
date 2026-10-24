/* @layer core @kind logic */
import { cellKey } from './cell-key';
import type { KeyChange } from './key-change.type';
import { rekeyCell } from './rekey-cell';

const replaceKeyInCells = (cells: Uint32Array, change: KeyChange, inside?: (index: number) => boolean): void => {
  for (const [index, cell] of cells.entries()) {
    if (cellKey(cell) !== change.from || (inside && !inside(index))) continue;
    cells[index] = rekeyCell(cell, change.to);
  }
};

export { replaceKeyInCells };
