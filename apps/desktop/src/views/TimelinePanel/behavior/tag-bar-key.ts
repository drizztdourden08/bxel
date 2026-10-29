/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { nudgeTag } from '../../../timeline/nudge-tag';
import type { TagBar } from '../../../timeline/timeline.type';
import { MOVE_KEYS } from '../TimelinePanel.constants';

const tagBarKey = (event: KeyboardEvent<HTMLElement>, bar: TagBar, editable: boolean): void => {
  if (event.key === 'Enter' && !bar.mirror) {
    event.preventDefault();
    event.stopPropagation();
    useTimelineStore.getState().setPopover({ kind: 'tag', tagId: bar.tagId });
    return;
  }
  const step = MOVE_KEYS[event.key] ?? 0;
  if (step === 0 || !editable || !event.altKey || !(event.shiftKey || event.ctrlKey)) return;
  event.preventDefault();
  event.stopPropagation();
  nudgeTag(bar.tagId, event.shiftKey ? 'resize' : 'move', step);
};

export { tagBarKey };
