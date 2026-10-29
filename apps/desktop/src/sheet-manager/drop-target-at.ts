/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { DropTarget } from './drag-payload.type';
import { ENTRY_SELECTOR } from './drop-target-at.constants';

const dropTargetAt = (point: Point): DropTarget => {
  const tile = document.elementFromPoint(point.x, point.y)?.closest(ENTRY_SELECTOR);
  if (!tile) return { key: null, side: 'after' };
  const box = tile.getBoundingClientRect();
  return { key: tile.getAttribute('data-sprite-id'), side: point.x < box.left + box.width / 2 ? 'before' : 'after' };
};

export { dropTargetAt };
