/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { currentFocus } from '../../../timeline/current-focus';
import { TIMELINE_MENU } from './timeline-menu.constants';
import { emptyEntries } from './empty-entries';
import { frameEntries } from './frame-entries';
import { rulerEntries } from './ruler-entries';
import { rulerFrame } from './ruler-frame';
import { tagEntries } from './tag-entries';

const timelineMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const tag = menuTarget(context, TIMELINE_MENU.tag);
  const frame = menuTarget(context, TIMELINE_MENU.frame);
  if (tag) return tagEntries(tag.dataset.tagId);
  if (frame) return frameEntries(frame.dataset.frameId ?? currentFocus()?.frame.id, context.selection);
  if (menuTarget(context, TIMELINE_MENU.ruler)) return rulerEntries(rulerFrame(context));
  return emptyEntries(menuTarget(context, TIMELINE_MENU.lane) !== null);
};

export { timelineMenuEntries };
