/* @layer core @kind logic */
import type { Animation } from '../model/animation.type';
import type { Sheet } from '../model/sheet.type';
import { sheetAnimationBox } from './sheet-animation-box';
import type { SheetBox, SheetSizes } from './sheet-overlap.type';

const spriteBoxes = (sheet: Sheet, sizes: SheetSizes): SheetBox[] =>
  sheet.entries.flatMap((entry) => {
    const size = sizes.get(entry.spriteId);
    if (!size) return [];
    const part = { kind: 'sprite', spriteId: entry.spriteId } as const;
    return [{ part, left: entry.at.x, top: entry.at.y, right: entry.at.x + size.width, bottom: entry.at.y + size.height }];
  });

const animationBoxes = (sheet: Sheet, animations: readonly Animation[]): SheetBox[] =>
  (sheet.animationEntries ?? []).flatMap((entry) => {
    const animation = animations.find((item) => item.id === entry.animationId);
    if (!animation) return [];
    const size = sheetAnimationBox(animation, entry, sheet.spacing);
    if (size.width === 0) return [];
    const part = { kind: 'animation', animationId: entry.animationId, tagId: entry.tagId } as const;
    return [{ part, left: entry.at.x, top: entry.at.y, right: entry.at.x + size.width, bottom: entry.at.y + size.height }];
  });

export { animationBoxes, spriteBoxes };
