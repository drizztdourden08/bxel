/* @layer renderer-app @kind logic */
import { STEP_KEYS } from '../TimelinePanel.constants';
import type { TimelineKeyAction, TimelineKeyInfo } from '../TimelinePanel.type';

const timelineKeyAction = (info: TimelineKeyInfo): TimelineKeyAction | null => {
  if (info.ctrlKey || info.metaKey) return null;
  const delta = STEP_KEYS[info.key];
  if (info.altKey) return delta !== undefined && (info.key === 'ArrowLeft' || info.key === 'ArrowRight') ? { kind: 'move', delta } : null;
  if (delta !== undefined) return { kind: 'step', delta, extend: info.shiftKey && info.key.startsWith('Arrow') };
  if (info.key === 'Home') return { kind: 'edge', end: 'first', extend: info.shiftKey };
  return info.key === 'End' ? { kind: 'edge', end: 'last', extend: info.shiftKey } : null;
};

export { timelineKeyAction };
