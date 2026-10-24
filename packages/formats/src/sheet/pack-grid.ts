/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { finishPack } from './finish-pack';
import { orientItem } from './orient-item';
import type { Fits } from './orient-item.type';
import type { GridLayout, PackedItem, PackItem, PackOptions, PackResult } from './sheet.type';

const packGrid = (items: readonly PackItem[], layout: GridLayout, options: PackOptions): PackResult => {
  const { margin, extrude, powerOfTwo, rotate } = options;
  const rows = Math.ceil(items.length / layout.columns);
  const byRows = layout.order === 'rows';
  const usedColumns = byRows ? Math.min(items.length, layout.columns) : Math.ceil(items.length / rows);
  const fits: Fits = (size) =>
    size.width + 2 * extrude <= layout.cellWidth && size.height + 2 * extrude <= layout.cellHeight;
  const placed: PackedItem[] = [];
  for (const [i, item] of items.entries()) {
    const shape = orientItem(item, rotate ? 'fit' : 'none', fits);
    if (!fits(shape)) {
      return formatFail(FORMAT_ERROR_CODE.SHEET_ITEM_TOO_LARGE, `Item ${item.key} does not fit its grid cell`);
    }
    const column = byRows ? i % layout.columns : Math.floor(i / rows);
    const row = byRows ? Math.floor(i / layout.columns) : i % rows;
    const x = margin + column * (layout.cellWidth + layout.spacingX) + extrude;
    const y = margin + row * (layout.cellHeight + layout.spacingY) + extrude;
    placed.push({ key: item.key, x, y, width: item.width, height: item.height, rotated: shape.rotated });
  }
  const width = 2 * margin + usedColumns * layout.cellWidth + (usedColumns - 1) * layout.spacingX;
  const height = 2 * margin + rows * layout.cellHeight + (rows - 1) * layout.spacingY;
  return finishPack(width, height, placed, powerOfTwo);
};

export { packGrid };
