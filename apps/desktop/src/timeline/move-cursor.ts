/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { cursorCel } from './cursor-cel';
import { goToCel } from './go-to-cel';
import type { CelMove } from './timeline.type';

const moveCursor = (by: CelMove, extend: boolean): void => {
  const target = currentTarget();
  const key = target ? cursorCel(target, by) : null;
  if (key) goToCel(key, extend);
};

export { moveCursor };
