/* @layer tests @kind logic */
import type { BufferView } from '../../packages/raster/src/index';

const toRows = (view: BufferView): string[] => {
  const rows: string[] = [];
  for (let y = 0; y < view.height; y++) {
    const row = view.pixels.subarray(y * view.width, (y + 1) * view.width);
    rows.push(Array.from(row, (value) => (value === 0 ? '.' : String(value))).join(''));
  }
  return rows;
};

export { toRows };
