/* @layer renderer-app @kind logic */
import type { AnimFrameId, TagId } from '@bxel/document';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { currentFocus } from '../../../timeline/current-focus';
import { currentSelection } from '../../../timeline/current-selection';
import { goToFrame } from '../../../timeline/go-to-frame';
import { selectTag } from '../../../timeline/select-tag';
import { TIMELINE_MENU } from '../TimelinePanel.constants';

const pickTimelineTarget = (context: ContextMenuContext): void => {
  const focus = currentFocus();
  if (!focus) return;
  const tag = menuTarget(context, TIMELINE_MENU.tag)?.dataset.tagId;
  if (tag !== undefined) {
    selectTag(tag as TagId);
    return;
  }
  const frame = menuTarget(context, TIMELINE_MENU.frame)?.dataset.frameId as AnimFrameId | undefined;
  if (frame !== undefined && !currentSelection(focus).includes(frame)) goToFrame(frame);
};

export { pickTimelineTarget };
