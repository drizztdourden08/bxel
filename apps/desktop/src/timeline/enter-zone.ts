/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import type { TimelineZone } from '../stores/timeline-store.type';
import { useTimelineStore } from '../stores/useTimelineStore';

const enterZone = (zone: TimelineZone): boolean => {
  const target = currentTarget();
  if (!target || (zone === 'tag' && target.sprite.tags.length === 0)) return false;
  useTimelineStore.getState().setZone(zone);
  return true;
};

export { enterZone };
