/* @layer core @kind logic */
import type { Sheet } from '../model/sheet.type';
import type { SpriteId } from '../model/ids.type';

const hasSheetEntry = (sheet: Sheet, spriteId: SpriteId): boolean =>
  sheet.entries.some((entry) => entry.spriteId === spriteId);

export { hasSheetEntry };
