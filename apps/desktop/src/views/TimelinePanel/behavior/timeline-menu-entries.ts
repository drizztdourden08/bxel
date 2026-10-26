/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { addFromEntries } from './add-from-entries';
import { transformEntries } from './transform-entries';
import { menuTarget } from '../../../context-menu/menu-target';
import { TIMELINE_MENU } from '../TimelinePanel.constants';
import { frameEntries } from './frame-entries';
import { tagEntries } from './tag-entries';

const timelineMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const tag = menuTarget(context, TIMELINE_MENU.tag);
  const frame = menuTarget(context, TIMELINE_MENU.frame);
  if (tag) return tagEntries(tag.dataset.tagId);
  if (frame) return frameEntries(frame.dataset.frameId);
  const lane = menuTarget(context, TIMELINE_MENU.lane) !== null;
  return lane ? ['timeline.add_tag', 'timeline.select_all_frames', transformEntries()]
    : ['timeline.add_frame', addFromEntries(), 'timeline.toggle_onion', 'timeline.select_all_frames', transformEntries()];
};

export { timelineMenuEntries };
