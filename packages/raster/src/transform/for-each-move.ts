/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import type { Point, Rect } from '../geometry.type';
import { maskBounds } from '../selection/mask-bounds';
import { destinationPoint } from './destination-point';
import type { MoveVisitor, Orientation } from './transform.type';

const destinationIndex = (mask: MaskView, box: Rect, orientation: Orientation, from: Point): number => {
  const moved = destinationPoint(orientation, box, { x: from.x - box.x, y: from.y - box.y });
  const column = box.x + moved.x;
  const row = box.y + moved.y;
  return column < mask.width && row < mask.height ? row * mask.width + column : -1;
};

const forEachMove = (mask: MaskView, orientation: Orientation, visit: MoveVisitor): void => {
  const box = maskBounds(mask);
  if (!box) {
    return;
  }
  for (let y = box.y; y < box.y + box.height; y++) {
    for (let x = box.x; x < box.x + box.width; x++) {
      if ((mask.bits[y * mask.width + x] ?? 0) !== 0) {
        visit(y * mask.width + x, destinationIndex(mask, box, orientation, { x, y }));
      }
    }
  }
};

export { forEachMove };
