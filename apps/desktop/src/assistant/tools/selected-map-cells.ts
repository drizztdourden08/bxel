/* @layer renderer-app @kind logic */
import { cellKey, cellMaskBounds, flagBitsOf, resolveCellMask } from '@bxel/document';
import type { CellMaskDescriptor, MapLayer, Tilemap } from '@bxel/document';
import { MAX_REPLY_CELLS } from './selected-map-cells.constants';

const selectedMapCells = (map: Tilemap, layer: MapLayer, mask: CellMaskDescriptor) => {
  const resolved = resolveCellMask(mask, { columns: map.columns, rows: map.rows, cells: layer.cells });
  const cells: [number, number, number, number][] = [];
  let count = 0;
  resolved.forEach((bit, index) => {
    if (bit !== 1) return;
    count += 1;
    if (cells.length >= MAX_REPLY_CELLS) return;
    const cell = layer.cells[index] ?? 0;
    cells.push([index % map.columns, Math.floor(index / map.columns), cellKey(cell), flagBitsOf(cell)]);
  });
  return { count, bounds: cellMaskBounds(resolved, map.columns), cells, truncated: count > cells.length };
};

export { selectedMapCells };
