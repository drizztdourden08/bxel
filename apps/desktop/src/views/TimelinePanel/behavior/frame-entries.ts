/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { currentFocus } from '../../../timeline/current-focus';
import { addFromEntries } from './add-from-entries';
import { transformEntries } from './transform-entries';
import { currentSelection } from '../../../timeline/current-selection';
import { DURATION_CHOICES, TIMELINE_MENU } from '../TimelinePanel.constants';

const frameEntries = (frameId: string | undefined): readonly ContextMenuEntry[] => {
  const focus = currentFocus();
  if (!focus) return [];
  const { frames } = focus.animation;
  const all = frames.map((frame) => frame.id);
  const picked = currentSelection(focus);
  const durations = new Set(frames.filter((frame) => picked.includes(frame.id)).map((frame) => frame.durationMs));
  const shared = durations.size === 1 ? [...durations][0] : undefined;
  return [
    { command: 'timeline.go_to_frame', label: TIMELINE_MENU.goTo, args: { frameId }, hidden: frameId === focus.frame.id },
    { command: 'timeline.play_from', label: TIMELINE_MENU.playFrom, args: { frameId } },
    {
      label: TIMELINE_MENU.duration,
      items: [
        ...DURATION_CHOICES.map((ms) => ({ command: 'timeline.set_duration', label: `${ms} ms`, args: { ms }, kind: 'radio' as const, checked: shared === ms })),
        { command: 'timeline.focus_duration', label: TIMELINE_MENU.otherDuration },
      ],
    },
    { command: 'timeline.add_frame', label: TIMELINE_MENU.addFrame },
    addFromEntries(),
    { command: 'timeline.duplicate_frames', label: TIMELINE_MENU.duplicateFrames },
    { command: 'timeline.move_frames_earlier', label: TIMELINE_MENU.earlier, ...unless(!picked.some((id) => all.indexOf(id) === 0), TIMELINE_MENU.firstFrame) },
    { command: 'timeline.move_frames_later', label: TIMELINE_MENU.later, ...unless(!picked.some((id) => all.indexOf(id) === all.length - 1), TIMELINE_MENU.lastFrame) },
    { command: 'timeline.add_tag', label: TIMELINE_MENU.addTag },
    { command: 'timeline.toggle_onion', label: TIMELINE_MENU.onion },
    { command: 'timeline.select_all_frames', label: TIMELINE_MENU.selectAll },
    transformEntries(),
    'separator',
    { command: 'timeline.delete_frames', label: TIMELINE_MENU.deleteFrames, ...unless(frames.length > picked.length, TIMELINE_MENU.oneFrame) },
  ];
};

export { frameEntries };
