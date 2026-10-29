/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { dropTargetAt } from './drop-target-at';
import { ENTRY_SELECTOR } from './drop-target-at.constants';

const dropMarkIndex = (point: Point): number | null => {
  const tile = document.elementFromPoint(point.x, point.y)?.closest(ENTRY_SELECTOR);
  if (!tile) return null;
  const at = [...document.querySelectorAll(ENTRY_SELECTOR)].indexOf(tile);
  return at * 2 + (dropTargetAt(point).side === 'after' ? 1 : 0);
};

export { dropMarkIndex };
