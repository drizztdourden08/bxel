/* @layer renderer-app @kind logic */
import type { LaneKeyAction, TimelineKeyInfo } from '../TimelinePanel.type';

const tagKeyAction = (info: TimelineKeyInfo): LaneKeyAction | null => {
  if (info.altKey) return null;
  if (info.key === 'ArrowLeft') return { kind: 'tag', delta: -1 };
  if (info.key === 'ArrowRight') return { kind: 'tag', delta: 1 };
  if (info.key === 'ArrowDown') return { kind: 'zone', zone: 'head' };
  return info.key === 'Delete' ? { kind: 'deleteTag' } : null;
};

export { tagKeyAction };
