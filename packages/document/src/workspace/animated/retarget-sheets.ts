/* @layer core @kind logic */
import type { AnimationId, SpriteId } from '../../model/ids.type';
import type { Sheet } from '../../model/sheet.type';

const retargetSheets = (sheets: readonly Sheet[], spriteId: SpriteId, animationId: AnimationId): readonly Sheet[] =>
  sheets.map((sheet) => {
    const placed = sheet.entries.filter((entry) => entry.spriteId === spriteId);
    if (placed.length === 0) return sheet;
    return {
      ...sheet,
      entries: sheet.entries.filter((entry) => entry.spriteId !== spriteId),
      animationEntries: [
        ...(sheet.animationEntries ?? []),
        ...placed.slice(0, 1).map((entry) => ({ animationId, tagId: null, at: entry.at })),
      ],
    };
  });

export { retargetSheets };
