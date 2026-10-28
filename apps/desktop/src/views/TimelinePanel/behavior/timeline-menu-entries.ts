/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { unless } from '../../../context-menu/unless';
import { currentFocus } from '../../../timeline/current-focus';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { THUMB_SIZES } from '../../../stores/timeline-store.constants';
import { TIMELINE_MENU, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import { addFromEntries } from './add-from-entries';
import { frameEntries } from './frame-entries';
import { tagEntries } from './tag-entries';
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

const rulerEntries = (): readonly ContextMenuEntry[] => {
  const { loopRange, units } = useTimelineStore.getState();
  return [
    { command: 'timeline.play_from', label: TIMELINE_MENU.playFrom },
    { command: 'timeline.set_loop_range', label: TIMELINE_MENU.setLoopRange },
    { command: 'timeline.clear_loop_range', label: TIMELINE_MENU.clearLoopRange, ...unless(loopRange !== null, TIMELINE_MENU.noLoop) },
    {
      label: TIMELINE_MENU.units,
      items: (['ms', 'seconds', 'ticks'] as const).map((each) => ({ command: 'timeline.set_units', label: TIMELINE_PANEL_TEXT.unitNames[each], args: { units: each }, kind: 'radio' as const, checked: units === each })),
    },
    { command: 'timeline.onion_settings', label: TIMELINE_MENU.onionSettings },
  ];
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

const timelineMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const tag = menuTarget(context, TIMELINE_MENU.tag);
  const frame = menuTarget(context, TIMELINE_MENU.frame);
  if (tag) return tagEntries(tag.dataset.tagId);
  if (frame) return frameEntries(frame.dataset.frameId ?? currentFocus()?.frame.id);
  if (menuTarget(context, TIMELINE_MENU.ruler)) return rulerEntries();
  return emptyEntries(menuTarget(context, TIMELINE_MENU.lane) !== null);
};

export { emptyEntries, rulerEntries, timelineMenuEntries };
