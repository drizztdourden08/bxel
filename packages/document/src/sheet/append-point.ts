/* @layer core @kind logic */
import type { Point } from '../model/geometry.type';
import type { Sheet } from '../model/sheet.type';
import type { SheetSizes } from './sheet-overlap.type';

const appendPoint = (sheet: Sheet, sizes: SheetSizes): Point => {
  let right = -1;
  for (const entry of sheet.entries) {
    right = Math.max(right, entry.at.x + (sizes.get(entry.spriteId)?.width ?? 0));
  }
  return { x: right < 0 ? sheet.margin : right + sheet.spacing.x, y: sheet.margin };
};

export { appendPoint };
