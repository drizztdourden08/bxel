/* @layer core @kind logic */
import type { Animation } from '../model/animation.type';
import type { Point, Size } from '../model/geometry.type';
import type { SheetAnimationEntry } from '../model/sheet.type';
import { animationCells } from '../read/animation-cells';

const sheetAnimationBox = (animation: Animation, entry: SheetAnimationEntry, spacing: Point): Size => {
  const count = animationCells(animation, entry.tagId).length;
  return { width: count === 0 ? 0 : count * animation.width + (count - 1) * spacing.x, height: count === 0 ? 0 : animation.height };
};

export { sheetAnimationBox };
