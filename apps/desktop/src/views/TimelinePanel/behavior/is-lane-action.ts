/* @layer renderer-app @kind logic */
import { LANE_KINDS } from '../TimelinePanel.constants';
import type { LaneKeyAction, TimelineKeyAction } from '../TimelinePanel.type';

const isLaneAction = (action: TimelineKeyAction): action is LaneKeyAction => LANE_KINDS.has(action.kind);

export { isLaneAction };
