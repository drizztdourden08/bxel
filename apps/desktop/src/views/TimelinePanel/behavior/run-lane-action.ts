/* @layer renderer-app @kind logic */
import { addPick } from '../../../timeline/add-pick';
import { enterZone } from '../../../timeline/enter-zone';
import { parkCursor } from '../../../timeline/park-cursor';
import { stepFrame } from '../../../timeline/step-frame';
import { stepTag } from '../../../timeline/step-tag';
import type { LaneKeyAction } from '../TimelinePanel.type';

const runLaneAction = (action: LaneKeyAction): void => {
  switch (action.kind) {
    case 'park':
      parkCursor(action.by);
      return;
    case 'addPick':
      addPick();
      return;
    case 'frame':
      stepFrame(action.delta, action.extend);
      return;
    case 'zone':
      enterZone(action.zone);
      return;
    case 'tag':
      stepTag(action.delta);
  }
};

export { runLaneAction };
