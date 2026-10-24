/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { clearCels } from '../../../timeline/clear-cels';
import { jumpFrame } from '../../../timeline/jump-frame';
import { moveCels } from '../../../timeline/move-cels';
import { moveCursor } from '../../../timeline/move-cursor';
import { moveFrames } from '../../../timeline/move-frames';
import type { TimelineKeyAction } from '../TimelinePanel.type';
import { isLaneAction } from './is-lane-action';
import { runLaneAction } from './run-lane-action';

const runKeyAction = (action: TimelineKeyAction): void => {
  if (isLaneAction(action)) {
    runLaneAction(action);
    return;
  }
  switch (action.kind) {
    case 'play':
      useTimelineStore.getState().togglePlay();
      return;
    case 'cursor':
      moveCursor(action.by, action.extend);
      return;
    case 'edge':
      jumpFrame(action.end);
      return;
    case 'moveFrames':
      moveFrames(action.delta);
      return;
    case 'moveCels':
      moveCels(action.by);
      return;
    case 'clear':
      clearCels();
  }
};

export { runKeyAction };
