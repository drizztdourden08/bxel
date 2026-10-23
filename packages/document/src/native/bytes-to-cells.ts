/* @layer core @kind logic */
import { CELL_BYTES } from './container.constants';

const bytesToCells = (bytes: Uint8Array): Uint32Array => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const cells = new Uint32Array(bytes.length / CELL_BYTES);
  for (let index = 0; index < cells.length; index += 1) cells[index] = view.getUint32(index * CELL_BYTES, true);
  return cells;
};

export { bytesToCells };
