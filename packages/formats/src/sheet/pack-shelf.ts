/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { finishPack } from './finish-pack';
import type { PackedItem, PackedLayout, PackItem, PackOptions, PackResult, Shelf } from './sheet.type';
import { shelfOrder } from './shelf-order';
import { takeShelfSlot } from './take-shelf-slot';

const packShelf = (items: readonly PackItem[], layout: PackedLayout, options: PackOptions): PackResult => {
  const { margin, extrude, powerOfTwo } = options;
  const usable = layout.maxWidth - 2 * margin;
  const shelves: Shelf[] = [];
  const placed: { readonly index: number; readonly item: PackedItem }[] = [];
  for (const index of shelfOrder(items)) {
    const item = items[index];
    if (!item) continue;
    const size = { width: item.width + 2 * extrude, height: item.height + 2 * extrude };
    if (size.width > usable) {
      return formatFail(FORMAT_ERROR_CODE.SHEET_ITEM_TOO_LARGE, `Item ${item.key} is wider than the sheet`);
    }
    const slot = takeShelfSlot(shelves, size, layout.padding, usable);
    const x = margin + slot.x + extrude;
    const y = margin + slot.shelf.y + extrude;
    placed.push({ index, item: { key: item.key, x, y, width: item.width, height: item.height } });
  }
  const last = shelves.at(-1);
  const width = 2 * margin + Math.max(...shelves.map((shelf) => shelf.used));
  const height = 2 * margin + (last ? last.y + last.height : 0);
  const ordered = placed.sort((a, b) => a.index - b.index).map((entry) => entry.item);
  return finishPack(width, height, ordered, powerOfTwo);
};

export { packShelf };
