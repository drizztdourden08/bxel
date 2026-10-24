/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { finishPack } from './finish-pack';
import { orientItem } from './orient-item';
import type { PackedItem, PackedLayout, PackItem, PackOptions, PackResult, RotateMode, Shelf } from './sheet.type';
import { shelfOrder } from './shelf-order';
import { smallerPack } from './smaller-pack';
import { takeShelfSlot } from './take-shelf-slot';

const shelfPass = (items: readonly PackItem[], layout: PackedLayout, options: PackOptions, mode: RotateMode): PackResult => {
  const { margin, extrude, powerOfTwo } = options;
  const usable = layout.maxWidth - 2 * margin;
  const oriented = items.map((item) => orientItem(item, mode, (size) => size.width + 2 * extrude <= usable));
  const shelves: Shelf[] = [];
  const placed: { readonly index: number; readonly item: PackedItem }[] = [];
  for (const index of shelfOrder(oriented)) {
    const item = items[index];
    const shape = oriented[index];
    if (!item || !shape) continue;
    const size = { width: shape.width + 2 * extrude, height: shape.height + 2 * extrude };
    if (size.width > usable) {
      return formatFail(FORMAT_ERROR_CODE.SHEET_ITEM_TOO_LARGE, `Item ${item.key} is wider than the sheet`);
    }
    const slot = takeShelfSlot(shelves, size, layout.padding, usable);
    const x = margin + slot.x + extrude;
    const y = margin + slot.shelf.y + extrude;
    placed.push({ index, item: { key: item.key, x, y, width: item.width, height: item.height, rotated: shape.rotated } });
  }
  const last = shelves.at(-1);
  const width = 2 * margin + Math.max(...shelves.map((shelf) => shelf.used));
  const height = 2 * margin + (last ? last.y + last.height : 0);
  const ordered = placed.sort((a, b) => a.index - b.index).map((entry) => entry.item);
  return finishPack(width, height, ordered, powerOfTwo);
};

const packShelf = (items: readonly PackItem[], layout: PackedLayout, options: PackOptions): PackResult =>
  options.rotate
    ? smallerPack(shelfPass(items, layout, options, 'fit'), shelfPass(items, layout, options, 'landscape'))
    : shelfPass(items, layout, options, 'none');

export { packShelf };
