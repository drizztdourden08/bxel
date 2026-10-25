/* @layer core @kind logic */
import { CELL_BYTES } from './container.constants';

const encoded = new WeakMap<Uint32Array, Uint8Array>();

const cellsToBytes = (cells: Uint32Array): Uint8Array => {
  const known = encoded.get(cells);
  if (known !== undefined) return known;
  const out = new Uint8Array(cells.length * CELL_BYTES);
  const view = new DataView(out.buffer);
  for (const [index, cell] of cells.entries()) view.setUint32(index * CELL_BYTES, cell, true);
  encoded.set(cells, out);
  return out;
};

export { cellsToBytes };
