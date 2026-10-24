/* @layer core @kind logic */
import type { Sheet } from '../model/sheet.type';
import type { SheetOverlap, SheetSizes } from './sheet-overlap.type';

const findOverlaps = (sheet: Sheet, sizes: SheetSizes): SheetOverlap[] => {
  const placed = sheet.entries.flatMap((entry) => {
    const size = sizes.get(entry.spriteId);
    if (!size) return [];
    return [{ id: entry.spriteId, left: entry.at.x, top: entry.at.y, right: entry.at.x + size.width, bottom: entry.at.y + size.height }];
  });
  const found: SheetOverlap[] = [];
  for (const [index, first] of placed.entries()) {
    for (const second of placed.slice(index + 1)) {
      const apart = first.right <= second.left || second.right <= first.left || first.bottom <= second.top || second.bottom <= first.top;
      if (!apart) found.push({ first: first.id, second: second.id });
    }
  }
  return found;
};

export { findOverlaps };
