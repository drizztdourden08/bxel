/* @layer core @kind logic */
import type { Animation } from '../model/animation.type';
import type { Size } from '../model/geometry.type';
import type { Sheet } from '../model/sheet.type';
import { sheetAnimationBox } from './sheet-animation-box';
import type { SheetSizes } from './sheet-overlap.type';

const sheetExtent = (sheet: Sheet, sizes: SheetSizes, animations: readonly Animation[] = []): Size => {
  let width = 0;
  let height = 0;
  for (const entry of sheet.entries) {
    const size = sizes.get(entry.spriteId);
    if (size) {
      width = Math.max(width, entry.at.x + size.width);
      height = Math.max(height, entry.at.y + size.height);
    }
  }
  for (const entry of sheet.animationEntries ?? []) {
    const animation = animations.find((item) => item.id === entry.animationId);
    const box = animation ? sheetAnimationBox(animation, entry, sheet.spacing) : { width: 0, height: 0 };
    if (box.width > 0) {
      width = Math.max(width, entry.at.x + box.width);
      height = Math.max(height, entry.at.y + box.height);
    }
  }
  return { width: width + sheet.margin, height: height + sheet.margin };
};

export { sheetExtent };
