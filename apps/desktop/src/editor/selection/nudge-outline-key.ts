/* @layer renderer-app @kind logic */
import { nudgeSteps } from '../transform/nudge-steps';
import type { NudgeKey } from '../transform/nudge-key.type';
import { nudgeOutline } from './nudge-outline';
import { ARROW_DELTAS } from './selection.constants';

const nudgeOutlineKey = (event: NudgeKey): void => {
  const delta = ARROW_DELTAS[event.key];
  if (!delta || event.ctrlKey || event.metaKey || event.altKey) return;
  const step = nudgeSteps(event.shiftKey);
  if (nudgeOutline(delta.x * step.x, delta.y * step.y)) event.preventDefault();
};

export { nudgeOutlineKey };
