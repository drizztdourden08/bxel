/* @layer core @kind logic */
import type { Size } from '../model/geometry.type';
import type { Sheet } from '../model/sheet.type';
import type { SheetSizes } from './sheet-overlap.type';

const sheetExtent = (sheet: Sheet, sizes: SheetSizes): Size => {
  let width = 0;
  let height = 0;
  for (const entry of sheet.entries) {
    const size = sizes.get(entry.spriteId);
    if (size) {
      width = Math.max(width, entry.at.x + size.width);
      height = Math.max(height, entry.at.y + size.height);
    }
  }
  return { width: width + sheet.margin, height: height + sheet.margin };
};

export { sheetExtent };
