/* @layer core @kind logic */
import type { Rect } from '../../model/geometry.type';
import type { Sprite } from '../../model/sprite.type';
import type { AnimStripGrid } from '../../schema/animation-options.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import type { StripLayout } from './strip-cells.type';

const layoutOf = (sprite: Sprite, grid: AnimStripGrid, path: string): StripLayout => {
  if ('columns' in grid) {
    const cellWidth = sprite.width / grid.columns;
    const cellHeight = sprite.height / grid.rows;
    if (!Number.isInteger(cellWidth) || !Number.isInteger(cellHeight)) {
      throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${sprite.name}" does not divide into ${grid.columns} by ${grid.rows} equal cells.`, { path });
    }
    return { columns: grid.columns, rows: grid.rows, cellWidth, cellHeight };
  }
  const columns = Math.floor(sprite.width / grid.cellWidth);
  const rows = Math.floor(sprite.height / grid.cellHeight);
  if (columns < 1 || rows < 1) {
    throw fail(ERROR_CODE.INVALID_OPTION, `A ${grid.cellWidth} by ${grid.cellHeight} cell does not fit sprite "${sprite.name}".`, { path });
  }
  return { columns, rows, cellWidth: grid.cellWidth, cellHeight: grid.cellHeight };
};

const stripCells = (sprite: Sprite, grid: AnimStripGrid, count: number | undefined, path: string): Rect[] => {
  const layout = layoutOf(sprite, grid, path);
  const total = layout.columns * layout.rows;
  if (count !== undefined && count > total) {
    throw fail(ERROR_CODE.INDEX_OUT_OF_RANGE, `The strip holds ${total} cells, not ${count}.`, { path });
  }
  return Array.from({ length: count ?? total }, (_, index) => ({
    x: (index % layout.columns) * layout.cellWidth,
    y: Math.floor(index / layout.columns) * layout.cellHeight,
    width: layout.cellWidth,
    height: layout.cellHeight,
  }));
};

export { stripCells };
