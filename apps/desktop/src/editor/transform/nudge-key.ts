/* @layer renderer-app @kind logic */
import { ARROW_DELTAS, NUDGE_STEP, NUDGE_STEP_FAST } from '../selection/selection.constants';
import { nudgeFloat } from './nudge-float';
import type { NudgeKey } from './nudge-key.type';

const nudgeKey = (event: NudgeKey): void => {
  const delta = ARROW_DELTAS[event.key];
  if (!delta || event.ctrlKey || event.metaKey || event.altKey) return;
  const step = event.shiftKey ? NUDGE_STEP_FAST : NUDGE_STEP;
  if (nudgeFloat(delta.x * step, delta.y * step)) event.preventDefault();
};

export { nudgeKey };
