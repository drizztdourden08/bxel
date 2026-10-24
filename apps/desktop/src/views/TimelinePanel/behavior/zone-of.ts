/* @layer renderer-app @kind logic */
import type { TimelineZone } from '../../../stores/timeline-store.type';
import { ZONE_ATTRIBUTE } from '../TimelinePanel.constants';

const zoneOf = (target: EventTarget): TimelineZone | null => {
  const found = target instanceof HTMLElement ? target.closest(`[${ZONE_ATTRIBUTE}]`)?.getAttribute(ZONE_ATTRIBUTE) : undefined;
  return found === 'cel' || found === 'head' || found === 'tag' ? found : null;
};

export { zoneOf };
