/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import { TIMELINE_MENU } from './timeline-menu.constants';

const rulerEntries = (frameId?: string): readonly ContextMenuEntry[] => {
  const { loopRange, units } = useTimelineStore.getState();
  return [
    { command: 'timeline.play_from', label: TIMELINE_MENU.playFrom, args: { frameId } },
    { command: 'timeline.set_loop_range', label: TIMELINE_MENU.setLoopRange },
    { command: 'timeline.clear_loop_range', label: TIMELINE_MENU.clearLoopRange, ...unless(loopRange !== null, TIMELINE_MENU.noLoop) },
    {
      label: TIMELINE_MENU.units,
      items: (['ms', 'seconds', 'ticks'] as const).map((each) => ({ command: 'timeline.set_units', label: TIMELINE_PANEL_TEXT.unitNames[each], args: { units: each }, kind: 'radio' as const, checked: units === each })),
    },
    { command: 'timeline.onion_settings', label: TIMELINE_MENU.onionSettings },
  ];
};

export { rulerEntries };
