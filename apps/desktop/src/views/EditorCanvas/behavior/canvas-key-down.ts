/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';
import { ARROW_DELTAS, NUDGE_STEP, NUDGE_STEP_FAST } from '../../../editor/selection/selection.constants';
import { nudgeFloat } from '../../../editor/transform/nudge-float';

const canvasKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
  const delta = ARROW_DELTAS[event.key];
  if (!delta || event.ctrlKey || event.metaKey || event.altKey) return;
  const step = event.shiftKey ? NUDGE_STEP_FAST : NUDGE_STEP;
  if (nudgeFloat(delta.x * step, delta.y * step)) event.preventDefault();
};

export { canvasKeyDown };
