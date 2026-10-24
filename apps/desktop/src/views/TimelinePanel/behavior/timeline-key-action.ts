/* @layer renderer-app @kind logic */
import type { TimelineZone } from '../../../stores/timeline-store.type';
import { STEP_KEYS } from '../TimelinePanel.constants';
import type { TimelineKeyAction, TimelineKeyInfo } from '../TimelinePanel.type';
import { celKeyAction } from './cel-key-action';
import { ctrlKeyAction } from './ctrl-key-action';
import { headKeyAction } from './head-key-action';
import { tagKeyAction } from './tag-key-action';

const zoneAction = (info: TimelineKeyInfo, zone: TimelineZone | null): TimelineKeyAction | null => {
  if (zone === 'cel') return celKeyAction(info);
  if (zone === 'head') return headKeyAction(info);
  return zone === 'tag' ? tagKeyAction(info) : null;
};

const timelineKeyAction = (info: TimelineKeyInfo, zone: TimelineZone | null): TimelineKeyAction | null => {
  if (info.ctrlKey || info.metaKey) return zone === 'cel' ? ctrlKeyAction(info) : null;
  const step = STEP_KEYS[info.key];
  if (step !== undefined && !info.altKey) return { kind: 'cursor', by: { frames: step, layers: 0 }, extend: false };
  return zoneAction(info, zone);
};

export { timelineKeyAction };
