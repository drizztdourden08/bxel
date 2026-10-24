/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { SheetItem } from '../../../sheet/sheet.type';

const hitSprite = (items: readonly SheetItem[], at: Point): SheetItem | null => {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const item = items[index];
    if (item && at.x >= item.at.x && at.y >= item.at.y && at.x < item.at.x + item.sprite.width && at.y < item.at.y + item.sprite.height) {
      return item;
    }
  }
  return null;
};

export { hitSprite };
