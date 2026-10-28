/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { THUMB_SIZES } from '../../../stores/timeline-store.constants';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import { TIMELINE_MENU } from '../TimelinePanel.menu.constants';
import { addFromEntries } from './add-from-entries';
import { transformEntries } from './transform-entries';

const zoomEntries = (): ContextMenuEntry => {
  const { zoom, fit } = useTimelineStore.getState();
  return {
    label: TIMELINE_MENU.zoom,
    items: [
      ...THUMB_SIZES.map((size) => ({ command: 'timeline.set_zoom', label: TIMELINE_PANEL_TEXT.zoomSize(size), args: { size }, kind: 'radio' as const, checked: !fit && zoom === size })),
      { command: 'timeline.set_zoom', label: TIMELINE_MENU.fit, args: { size: 'fit' }, kind: 'radio' as const, checked: fit },
    ],
  };
};

const emptyEntries = (lane: boolean): readonly ContextMenuEntry[] => [
  ...(lane ? [{ command: 'timeline.add_tag', label: TIMELINE_MENU.addTag }] : []),
  { command: 'timeline.add_frame', label: TIMELINE_MENU.addFrame },
  addFromEntries(),
  { command: 'timeline.paste_frames', label: TIMELINE_MENU.paste },
  { command: 'timeline.select_all_frames', label: TIMELINE_MENU.selectAll },
  { command: 'timeline.toggle_onion', label: TIMELINE_MENU.onion },
  { command: 'timeline.toggle_time_mode', label: TIMELINE_MENU.timeMode },
  zoomEntries(),
  transformEntries(),
];

export { emptyEntries };
