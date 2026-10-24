/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { finishPack } from './finish-pack';
import type { GridLayout, PackedItem, PackItem, PackResult } from './sheet.type';

const packGrid = (
  items: readonly PackItem[],
  layout: GridLayout,
  margin: number,
  extrude: number,
): PackResult => {
  const rows = Math.ceil(items.length / layout.columns);
  const byRows = layout.order === 'rows';
  const usedColumns = byRows ? Math.min(items.length, layout.columns) : Math.ceil(items.length / rows);
  const placed: PackedItem[] = [];
  for (const [i, item] of items.entries()) {
    if (item.width + 2 * extrude > layout.cellWidth || item.height + 2 * extrude > layout.cellHeight) {
      return formatFail(FORMAT_ERROR_CODE.SHEET_ITEM_TOO_LARGE, `Item ${item.key} does not fit its grid cell`);
    }
    const column = byRows ? i % layout.columns : Math.floor(i / rows);
    const row = byRows ? Math.floor(i / layout.columns) : i % rows;
    const x = margin + column * (layout.cellWidth + layout.spacingX) + extrude;
    const y = margin + row * (layout.cellHeight + layout.spacingY) + extrude;
    placed.push({ key: item.key, x, y, width: item.width, height: item.height });
  }
  const width = 2 * margin + usedColumns * layout.cellWidth + (usedColumns - 1) * layout.spacingX;
  const height = 2 * margin + rows * layout.cellHeight + (rows - 1) * layout.spacingY;
  return finishPack(width, height, placed);
};

export { packGrid };
