/* @layer tests @kind logic */
import type { MaskView } from '../../packages/raster/src/index';

const maskFromRows = (rows: readonly string[]): MaskView => {
  const width = rows[0]?.length ?? 0;
  const bits = new Uint8Array(width * rows.length);
  for (const [y, row] of rows.entries()) {
    for (const [x, cell] of [...row].entries()) {
      bits[y * width + x] = cell === '#' ? 1 : 0;
    }
  }
  return { bits, width, height: rows.length };
};

export { maskFromRows };
