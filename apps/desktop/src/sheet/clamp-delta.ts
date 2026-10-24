/* @layer renderer-app @kind logic */
import type { Point, SpriteId } from '@bxel/document';
import type { SheetItem } from './sheet.type';

const clampDelta = (items: readonly SheetItem[], ids: readonly SpriteId[], delta: Point): Point => {
  const moved = items.filter((item) => ids.includes(item.sprite.id));
  const left = Math.min(...moved.map((item) => item.at.x));
  const top = Math.min(...moved.map((item) => item.at.y));
  return { x: Math.max(delta.x, -left) || 0, y: Math.max(delta.y, -top) || 0 };
};

export { clampDelta };
