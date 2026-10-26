/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { currentTarget } from '../../../editor/current-target';
import { currentSelection } from '../../../timeline/current-selection';
import { DURATION_CHOICES, TIMELINE_MENU } from '../TimelinePanel.constants';

const frameEntries = (frameId: string | undefined): readonly ContextMenuEntry[] => {
  const target = currentTarget();
  if (!target) return [];
  const { frames } = target.sprite;
  const all = frames.map((frame) => frame.id);
  const picked = currentSelection(target).frames;
  const durations = new Set(frames.filter((frame) => picked.includes(frame.id)).map((frame) => frame.durationMs));
  const shared = durations.size === 1 ? [...durations][0] : undefined;
  return [
    { command: 'timeline.go_to_frame', label: TIMELINE_MENU.goTo, args: { frameId }, hidden: frameId === target.frameId },
    { command: 'timeline.play_from', label: TIMELINE_MENU.playFrom, args: { frameId } },
    {
      label: TIMELINE_MENU.duration,
      items: [
        ...DURATION_CHOICES.map((ms) => ({ command: 'timeline.set_duration', label: `${ms} ms`, args: { ms }, kind: 'radio' as const, checked: shared === ms })),
        { command: 'timeline.focus_duration', label: TIMELINE_MENU.otherDuration },
      ],
    },
    { command: 'timeline.add_frame', label: TIMELINE_MENU.addFrame },
    { command: 'timeline.duplicate_frames', label: TIMELINE_MENU.duplicateFrames },
    { command: 'timeline.move_frames_earlier', label: TIMELINE_MENU.earlier, ...unless(!picked.some((id) => all.indexOf(id) === 0), TIMELINE_MENU.firstFrame) },
    { command: 'timeline.move_frames_later', label: TIMELINE_MENU.later, ...unless(!picked.some((id) => all.indexOf(id) === all.length - 1), TIMELINE_MENU.lastFrame) },
    { command: 'timeline.add_tag', label: TIMELINE_MENU.addTag },
    { command: 'timeline.select_all_frames', label: TIMELINE_MENU.selectAll },
    'separator',
    { command: 'timeline.delete_frames', label: TIMELINE_MENU.deleteFrames, ...unless(frames.length > 1, TIMELINE_MENU.oneFrame) },
  ];
};

export { frameEntries };
