/* @layer renderer-app @kind logic */
import { ARROWS } from '../TimelinePanel.constants';
import type { LaneKeyAction, TimelineKeyInfo } from '../TimelinePanel.type';

const ctrlKeyAction = (info: TimelineKeyInfo): LaneKeyAction | null => {
  const arrow = ARROWS[info.key];
  if (arrow) return { kind: 'park', by: { frames: arrow[0], layers: arrow[1] } };
  return info.key === 'Enter' || info.key === ' ' ? { kind: 'addPick' } : null;
};

export { ctrlKeyAction };
