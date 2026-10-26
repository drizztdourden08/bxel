/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { TIMELINE_MENU } from '../TimelinePanel.constants';
import { layerEntriesFor } from '../../LayersPanel';
import { celEntries } from './cel-entries';
import { frameEntries } from './frame-entries';
import { tagEntries } from './tag-entries';

const timelineMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const tag = menuTarget(context, TIMELINE_MENU.tag);
  const cel = menuTarget(context, TIMELINE_MENU.cel);
  const head = menuTarget(context, TIMELINE_MENU.head);
  const label = menuTarget(context, TIMELINE_MENU.rowLabel);
  if (tag) return tagEntries(tag.dataset.tagId);
  if (cel) return celEntries(cel.dataset.layerId);
  if (head) return frameEntries(head.dataset.frameId);
  if (label) return layerEntriesFor(label.dataset.layerId);
  const lane = menuTarget(context, TIMELINE_MENU.lane) !== null;
  return lane ? ['timeline.add_tag', 'timeline.select_all_frames'] : celEntries(undefined);
};

export { timelineMenuEntries };
