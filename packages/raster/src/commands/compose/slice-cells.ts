/* @layer core @kind logic */
import type { SliceCell, SliceGrid } from './compose.type';

const sliceCells = (grid: SliceGrid): SliceCell[] =>
  Array.from({ length: grid.columns * grid.rows }, (_unused, index) => ({
    index,
    rect: {
      x: (index % grid.columns) * grid.cellWidth,
      y: Math.floor(index / grid.columns) * grid.cellHeight,
      width: grid.cellWidth,
      height: grid.cellHeight,
    },
  }));

export { sliceCells };
