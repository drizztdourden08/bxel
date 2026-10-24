/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { Size } from '@bxel/document';
import { MAX_PIECES } from './compose.constants';
import type { SliceGrid, SliceRequest } from './compose.type';

const byCount = (size: Size, columns: number, rows: number): SliceGrid => {
  if (size.width % columns !== 0 || size.height % rows !== 0) {
    throw fail(ERROR_CODE.INVALID_OPTION, `A sprite ${size.width} by ${size.height} does not divide into ${columns} columns and ${rows} rows.`);
  }
  return { columns, rows, cellWidth: size.width / columns, cellHeight: size.height / rows };
};

const bySize = (size: Size, cellWidth: number, cellHeight: number): SliceGrid => {
  const columns = Math.floor(size.width / cellWidth);
  const rows = Math.floor(size.height / cellHeight);
  if (columns < 1 || rows < 1) {
    throw fail(ERROR_CODE.INVALID_OPTION, `A cell of ${cellWidth} by ${cellHeight} is larger than the sprite, which is ${size.width} by ${size.height}.`);
  }
  return { columns, rows, cellWidth, cellHeight };
};

const sliceGrid = (size: Size, options: SliceRequest): SliceGrid => {
  const { columns, rows, cellWidth, cellHeight } = options;
  const grid =
    columns !== undefined && rows !== undefined
      ? byCount(size, columns, rows)
      : bySize(size, cellWidth ?? size.width, cellHeight ?? size.height);
  if (grid.columns * grid.rows < 2) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'The grid has one cell, so there is nothing to slice.');
  }
  if (grid.columns * grid.rows > MAX_PIECES) {
    throw fail(ERROR_CODE.LIMIT_REACHED, `A slice makes at most ${MAX_PIECES} sprites. This grid makes ${grid.columns * grid.rows}.`);
  }
  return grid;
};

export { sliceGrid };
