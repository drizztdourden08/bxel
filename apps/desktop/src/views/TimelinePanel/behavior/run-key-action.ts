/* @layer renderer-app @kind logic */
import { jumpFrame } from '../../../timeline/jump-frame';
import { moveFrames } from '../../../timeline/move-frames';
import { stepFrame } from '../../../timeline/step-frame';
import type { TimelineKeyAction } from '../TimelinePanel.type';

const runKeyAction = (action: TimelineKeyAction): void => {
  if (action.kind === 'step') stepFrame(action.delta, action.extend);
  else if (action.kind === 'edge') jumpFrame(action.end, action.extend);
  else moveFrames(action.delta);
};

export { runKeyAction };
