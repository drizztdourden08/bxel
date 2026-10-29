/* @layer renderer-app @kind logic */
import type { Rect, SheetPart } from '@bxel/document';
import type { SheetModel } from '../../../sheet/sheet.type';

const partRect = (model: SheetModel, part: SheetPart): Rect | null => {
  if (part.kind === 'sprite') {
    const item = model.items.find((each) => each.onSheet && each.sprite.id === part.spriteId);
    return item ? { x: item.at.x, y: item.at.y, width: item.sprite.width, height: item.sprite.height } : null;
  }
  const strip = model.animations.find((each) => each.animationId === part.animationId && each.tagId === part.tagId);
  if (!strip) return null;
  const width = strip.images.reduce((sum, image, index) => sum + image.width + (index === 0 ? 0 : strip.spacing), 0);
  return { x: strip.at.x, y: strip.at.y, width, height: Math.max(0, ...strip.images.map((image) => image.height)) };
};

export { partRect };
