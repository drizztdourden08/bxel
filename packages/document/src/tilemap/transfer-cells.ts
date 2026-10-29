/* @layer core @kind logic */
import type { CellView } from './cell-mask.type';

type Transfer = {
  readonly view: CellView;
  readonly mask: Uint8Array;
  readonly by: { readonly x: number; readonly y: number };
  readonly skipEmpty: boolean;
};

type Moved = { readonly at: number; readonly value: number };

type Transferred = { readonly moved: readonly Moved[]; readonly outside: number };

const transferCells = (transfer: Transfer): Transferred => {
  const { view, mask, by, skipEmpty } = transfer;
  const moved: Moved[] = [];
  let outside = 0;
  mask.forEach((bit, index) => {
    const value = view.cells[index] ?? 0;
    if (bit !== 1 || (skipEmpty && value === 0)) return;
    const x = (index % view.columns) + by.x;
    const y = Math.floor(index / view.columns) + by.y;
    if (x < 0 || y < 0 || x >= view.columns || y >= view.rows) outside += 1;
    else moved.push({ at: y * view.columns + x, value });
  });
  return { moved, outside };
};

export { transferCells };
