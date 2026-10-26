/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { currentTarget } from '../../../editor/current-target';
import { currentSelection } from '../../../timeline/current-selection';
import { TIMELINE_MENU } from '../TimelinePanel.constants';

const frameSubmenu = (): ContextMenuEntry => {
  const target = currentTarget();
  const all = target?.sprite.frames.map((frame) => frame.id) ?? [];
  const picked = target ? currentSelection(target).frames : [];
  const first = picked.some((id) => all.indexOf(id) === 0);
  const last = picked.some((id) => all.indexOf(id) === all.length - 1);
  return {
    label: TIMELINE_MENU.frame,
    items: [
      { command: 'timeline.add_frame', label: TIMELINE_MENU.addFrame },
      { command: 'timeline.duplicate_frames', label: TIMELINE_MENU.duplicateFrames },
      { command: 'timeline.move_frames_earlier', label: TIMELINE_MENU.earlier, ...unless(!first, TIMELINE_MENU.firstFrame) },
      { command: 'timeline.move_frames_later', label: TIMELINE_MENU.later, ...unless(!last, TIMELINE_MENU.lastFrame) },
    ],
  };
};

export { frameSubmenu };
