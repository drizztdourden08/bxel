/* @layer core @kind logic */
import type { Sheet } from '../model/sheet.type';
import type { SheetBox, SheetSizes } from './sheet-overlap.type';

const spriteBoxes = (sheet: Sheet, sizes: SheetSizes): SheetBox[] =>
  sheet.entries.flatMap((entry) => {
    const size = sizes.get(entry.spriteId);
    if (!size) return [];
    const part = { kind: 'sprite', spriteId: entry.spriteId } as const;
    return [{ part, left: entry.at.x, top: entry.at.y, right: entry.at.x + size.width, bottom: entry.at.y + size.height }];
  });

export { spriteBoxes };
