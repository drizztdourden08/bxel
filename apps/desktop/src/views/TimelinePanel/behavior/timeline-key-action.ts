/* @layer renderer-app @kind logic */
import { EDGE_KEYS, MOVE_KEYS, STEP_KEYS } from '../TimelinePanel.constants';
import type { TimelineKeyAction, TimelineKeyInfo } from '../TimelinePanel.type';

const plainAction = (info: TimelineKeyInfo): TimelineKeyAction | null => {
  const delta = STEP_KEYS[info.key];
  if (delta !== undefined) return { kind: 'step', delta, extend: info.shiftKey && info.key.startsWith('Arrow') };
  const end = EDGE_KEYS[info.key];
  return end === undefined ? null : { kind: 'edge', end, extend: info.shiftKey };
};

const timelineKeyAction = (info: TimelineKeyInfo): TimelineKeyAction | null => {
  if (info.ctrlKey || info.metaKey) return null;
  if (!info.altKey) return plainAction(info);
  const delta = MOVE_KEYS[info.key];
  return delta === undefined ? null : { kind: 'move', delta };
};

export { timelineKeyAction };
