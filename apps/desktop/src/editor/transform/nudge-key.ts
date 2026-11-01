/* @layer renderer-app @kind logic */
import { ARROW_DELTAS } from '../selection/selection.constants';
import { nudgeFloat } from './nudge-float';
import { nudgeStep } from './nudge-step';
import type { NudgeKey } from './nudge-key.type';

const nudgeKey = (event: NudgeKey): void => {
  const delta = ARROW_DELTAS[event.key];
  if (!delta || event.ctrlKey || event.metaKey || event.altKey) return;
  const step = nudgeStep(event.shiftKey);
  if (nudgeFloat(delta.x * step, delta.y * step)) event.preventDefault();
};

export { nudgeKey };
