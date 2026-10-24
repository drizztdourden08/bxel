/* @layer renderer-app @kind logic */
import { MAX_IMPORT_SPRITES } from './image-import.constants';
import type { ImageExtent, SliceForm, SliceRect } from './image-import.type';

const whole = (values: readonly number[], least: number): boolean => values.every((value) => Number.isInteger(value) && value >= least);

const cellsAcross = (extent: number, offset: number, cell: number, spacing: number): number => {
  const room = extent - offset;
  return room < cell ? 0 : Math.floor((room + spacing) / (cell + spacing));
};

const rectAt = (index: number, slice: SliceForm, grid: { columns: number; rows: number }): SliceRect => {
  const byRows = slice.order === 'rows';
  const column = byRows ? index % grid.columns : Math.floor(index / grid.rows);
  const row = byRows ? Math.floor(index / grid.columns) : index % grid.rows;
  return {
    index,
    x: slice.offsetX + column * (slice.cellWidth + slice.spacingX),
    y: slice.offsetY + row * (slice.cellHeight + slice.spacingY),
    width: slice.cellWidth,
    height: slice.cellHeight,
  };
};

const sliceRects = (extent: ImageExtent, slice: SliceForm): SliceRect[] => {
  const valid = whole([slice.cellWidth, slice.cellHeight], 1) && whole([slice.offsetX, slice.offsetY, slice.spacingX, slice.spacingY], 0);
  if (!valid) return [];
  const columns = cellsAcross(extent.width, slice.offsetX, slice.cellWidth, slice.spacingX);
  const rows = cellsAcross(extent.height, slice.offsetY, slice.cellHeight, slice.spacingY);
  const total = Math.min(columns * rows, MAX_IMPORT_SPRITES + 1);
  return Array.from({ length: total }, (_, index) => rectAt(index, slice, { columns, rows }));
};

export { sliceRects };
