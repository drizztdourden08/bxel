/* @layer renderer-app @kind logic */
import type { Point, Rect } from '@bxel/document';

const onBorder = (rect: Rect, at: Point): boolean =>
  at.x === rect.x || at.y === rect.y || at.x === rect.x + rect.width - 1 || at.y === rect.y + rect.height - 1;

const rectCells = (rect: Rect, filled: boolean): Point[] => {
  const cells: Point[] = [];
  for (let y = rect.y; y < rect.y + rect.height; y += 1) {
    for (let x = rect.x; x < rect.x + rect.width; x += 1) {
      if (filled || onBorder(rect, { x, y })) cells.push({ x, y });
    }
  }
  return cells;
};

export { rectCells };
