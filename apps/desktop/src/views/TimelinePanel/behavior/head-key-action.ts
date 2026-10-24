/* @layer renderer-app @kind logic */
import { ARROWS, FAR_FRAME } from '../TimelinePanel.constants';
import type { TimelineKeyAction, TimelineKeyInfo } from '../TimelinePanel.type';

const arrowAction = (arrow: readonly [number, number], info: TimelineKeyInfo): TimelineKeyAction => {
  const [frames, layers] = arrow;
  if (layers !== 0) return { kind: 'zone', zone: layers > 0 ? 'tag' : 'cel' };
  if (info.altKey) return { kind: 'moveFrames', delta: frames };
  return { kind: 'frame', delta: frames, extend: info.shiftKey };
};

const headKeyAction = (info: TimelineKeyInfo): TimelineKeyAction | null => {
  const arrow = ARROWS[info.key];
  if (arrow) return arrowAction(arrow, info);
  if (info.key === 'Home') return { kind: 'frame', delta: -FAR_FRAME, extend: info.shiftKey };
  return info.key === 'End' ? { kind: 'frame', delta: FAR_FRAME, extend: info.shiftKey } : null;
};

export { headKeyAction };
