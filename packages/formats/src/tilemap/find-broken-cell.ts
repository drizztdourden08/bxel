/* @layer core @kind logic */
import { CELL_BITS } from './tilemap.constants';
import type { BrokenCell } from './broken-cell.type';
import type { TilemapExportInput } from './tilemap.type';

const findBrokenCell = (input: TilemapExportInput, keys: ReadonlySet<number>): BrokenCell | undefined => {
  for (const layer of input.layers) {
    for (const [index, cell] of layer.cells.entries()) {
      const key = cell & CELL_BITS.KEY_MASK;
      const reserved = (cell & CELL_BITS.RESERVED) !== 0;
      if (reserved || (key !== 0 && !keys.has(key))) {
        const x = index % input.columns;
        return { layer: layer.name, x, y: (index - x) / input.columns, key, reserved };
      }
    }
  }
  return undefined;
};

export { findBrokenCell };
