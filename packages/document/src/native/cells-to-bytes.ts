/* @layer core @kind logic */
import { CELL_BYTES } from './container.constants';

const cellsToBytes = (cells: Uint32Array): Uint8Array => {
  const out = new Uint8Array(cells.length * CELL_BYTES);
  const view = new DataView(out.buffer);
  for (const [index, cell] of cells.entries()) view.setUint32(index * CELL_BYTES, cell, true);
  return out;
};

export { cellsToBytes };
