/* @layer renderer-app @kind logic */
import { FACING_SETS } from '@bxel/document';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { currentFocus } from '../../../timeline/current-focus';
import { THUMB_SIZES } from '../../../stores/timeline-store.constants';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import { TIMELINE_MENU } from './timeline-menu.constants';
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

const facingEntries = (): readonly ContextMenuEntry[] => {
  const animation = currentFocus()?.animation;
  if (!animation || FACING_SETS[animation.directions].length === 0) return [];
  return [{ command: 'timeline.toggle_group_facing', label: TIMELINE_MENU.groupFacing }];
};

const emptyEntries = (lane: boolean): readonly ContextMenuEntry[] => [
  ...(lane ? [{ command: 'timeline.add_tag', label: TIMELINE_MENU.addTag }] : []),
  { command: 'timeline.add_frame', label: TIMELINE_MENU.addFrame },
  addFromEntries(),
  { command: 'timeline.paste_frames', label: TIMELINE_MENU.paste },
  { command: 'timeline.select_all_frames', label: TIMELINE_MENU.selectAll },
  { command: 'timeline.toggle_onion', label: TIMELINE_MENU.onion },
  { command: 'timeline.toggle_time_mode', label: TIMELINE_MENU.timeMode },
  ...facingEntries(),
  zoomEntries(),
  transformEntries(),
];

export { emptyEntries };
