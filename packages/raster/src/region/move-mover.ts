/* @layer core @kind logic */
import type { Point } from '../geometry.type';
import { maskSource } from './mask-source';
import type { Mover } from './region.type';

const moveMover =
  (offset: Point): Mover =>
  ({ mask, box }) => ({
    area: { x: box.x + offset.x, y: box.y + offset.y, width: box.width, height: box.height },
    source: (x, y) => maskSource(mask, x - offset.x, y - offset.y),
  });

export { moveMover };
