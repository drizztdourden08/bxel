/* @layer renderer-app @kind logic */
import { ARROW_DELTAS } from '../selection/selection.constants';
import { nudgeFloat } from './nudge-float';
import { nudgeSteps } from './nudge-steps';
import type { NudgeKey } from './nudge-key.type';

const nudgeKey = (event: NudgeKey): void => {
  const delta = ARROW_DELTAS[event.key];
  if (!delta || event.ctrlKey || event.metaKey || event.altKey) return;
  const step = nudgeSteps(event.shiftKey);
  if (nudgeFloat(delta.x * step.x, delta.y * step.y)) event.preventDefault();
};

export { nudgeKey };
