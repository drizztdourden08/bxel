/* @layer renderer-app @kind logic */
import { ARROWS, STEP_KEYS } from '../TimelinePanel.constants';
import type { TimelineKeyAction, TimelineKeyInfo } from '../TimelinePanel.type';

const arrowAction = (arrow: readonly [number, number], info: TimelineKeyInfo): TimelineKeyAction | null => {
  const [frames, layers] = arrow;
  if (info.altKey && info.shiftKey) return { kind: 'moveCels', by: { frames, layers } };
  if (info.altKey) return frames === 0 ? null : { kind: 'moveFrames', delta: frames };
  return { kind: 'cursor', by: { frames, layers }, extend: info.shiftKey };
};

const gridKeyAction = (info: TimelineKeyInfo): TimelineKeyAction | null => {
  const arrow = ARROWS[info.key];
  if (arrow) return arrowAction(arrow, info);
  if (info.key === 'Enter' || info.key === ' ') return info.altKey ? null : { kind: 'play' };
  if (info.key === 'Home' || info.key === 'End') return { kind: 'edge', end: info.key === 'Home' ? 'first' : 'last' };
  return info.key === 'Delete' ? { kind: 'clear' } : null;
};

const timelineKeyAction = (info: TimelineKeyInfo, inGrid: boolean): TimelineKeyAction | null => {
  if (info.ctrlKey || info.metaKey) return null;
  const step = STEP_KEYS[info.key];
  if (step !== undefined && !info.altKey) return { kind: 'cursor', by: { frames: step, layers: 0 }, extend: false };
  return inGrid ? gridKeyAction(info) : null;
};

export { timelineKeyAction };
