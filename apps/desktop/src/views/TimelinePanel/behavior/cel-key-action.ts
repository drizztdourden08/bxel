/* @layer renderer-app @kind logic */
import { ARROWS } from '../TimelinePanel.constants';
import type { CelKeyAction, TimelineKeyInfo } from '../TimelinePanel.type';

const arrowAction = (arrow: readonly [number, number], info: TimelineKeyInfo): CelKeyAction | null => {
  const [frames, layers] = arrow;
  if (info.altKey && info.shiftKey) return { kind: 'moveCels', by: { frames, layers } };
  if (info.altKey) return frames === 0 ? null : { kind: 'moveFrames', delta: frames };
  return { kind: 'cursor', by: { frames, layers }, extend: info.shiftKey };
};

const celKeyAction = (info: TimelineKeyInfo): CelKeyAction | null => {
  const arrow = ARROWS[info.key];
  if (arrow) return arrowAction(arrow, info);
  if (info.key === 'Enter' || info.key === ' ') return info.altKey ? null : { kind: 'play' };
  if (info.key === 'Home' || info.key === 'End') return { kind: 'edge', end: info.key === 'Home' ? 'first' : 'last' };
  return null;
};

export { celKeyAction };
