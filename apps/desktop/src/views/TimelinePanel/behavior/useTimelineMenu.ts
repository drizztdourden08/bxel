/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { menuTarget } from '../../../context-menu/menu-target';
import { currentTarget } from '../../../editor/current-target';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { currentSelection } from '../../../timeline/current-selection';
import { goToCel } from '../../../timeline/go-to-cel';
import { goToFrame } from '../../../timeline/go-to-frame';
import { selectTag } from '../../../timeline/select-tag';
import { TIMELINE_MENU } from '../TimelinePanel.constants';
import { timelineMenuEntries } from './timeline-menu-entries';

const pickClicked = (context: ContextMenuContext): void => {
  const target = currentTarget();
  if (!target) return;
  const picked = currentSelection(target);
  const element = (selector: string): HTMLElement | null => menuTarget(context, selector);
  const sprite = target.sprite;
  const tag = sprite.tags.find((each) => each.id === element(TIMELINE_MENU.tag)?.dataset.tagId);
  const cel = element(TIMELINE_MENU.cel);
  const head = element(TIMELINE_MENU.head);
  const label = element(TIMELINE_MENU.rowLabel);
  const layer = sprite.layers.find((each) => each.id === (cel ?? label)?.dataset.layerId);
  const frame = sprite.frames.find((each) => each.id === (cel ?? head)?.dataset.frameId);
  if (tag) selectTag(tag.id);
  else if (cel && layer && frame && !(picked.frames.includes(frame.id) && picked.layers.includes(layer.id))) goToCel({ layerId: layer.id, frameId: frame.id });
  else if (head && frame && !picked.frames.includes(frame.id)) goToFrame(frame.id);
  else if (label && layer) useToolStore.getState().setLayer(layer.id);
};

const useTimelineMenu = (): void => {
  useContextMenu(COMMAND_ZONE.timeline, { label: TIMELINE_MENU.label, beforeOpen: pickClicked, entries: timelineMenuEntries });
};

export { useTimelineMenu };
