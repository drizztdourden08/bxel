/* @layer tests @kind logic */
import type { BufferView } from '../../packages/raster/src/index';

const fromRows = (rows: readonly string[]): BufferView => {
  const width = rows[0]?.length ?? 0;
  const pixels = new Uint8Array(width * rows.length);
  for (const [y, row] of rows.entries()) {
    for (const [x, cell] of [...row].entries()) {
      pixels[y * width + x] = cell === '.' ? 0 : Number(cell);
    }
  }
  return { pixels, width, height: rows.length };
};

export { fromRows };
