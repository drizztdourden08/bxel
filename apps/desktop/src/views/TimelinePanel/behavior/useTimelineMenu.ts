/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { currentTarget } from '../../../editor/current-target';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { currentSelection } from '../../../timeline/current-selection';
import { goToCel } from '../../../timeline/go-to-cel';
import { goToFrame } from '../../../timeline/go-to-frame';
import { selectTag } from '../../../timeline/select-tag';
import { TIMELINE_MENU } from '../TimelinePanel.constants';
import { timelineClicked } from './timeline-clicked';
import { timelineMenuEntries } from './timeline-menu-entries';

const pickClicked = (context: ContextMenuContext): void => {
  const target = currentTarget();
  if (!target) return;
  const picked = currentSelection(target);
  const { kind, tag, layer, frame } = timelineClicked(context, target.sprite);
  const framePicked = frame !== undefined && picked.frames.includes(frame.id);
  if (kind === 'tag' && tag) selectTag(tag.id);
  else if (kind === 'cel' && layer && frame && !(framePicked && picked.layers.includes(layer.id))) goToCel({ layerId: layer.id, frameId: frame.id });
  else if (kind === 'head' && frame && !framePicked) goToFrame(frame.id);
  else if (kind === 'label' && layer) useToolStore.getState().setLayer(layer.id);
};

const useTimelineMenu = (): void => {
  useContextMenu(COMMAND_ZONE.timeline, { label: TIMELINE_MENU.label, beforeOpen: pickClicked, entries: timelineMenuEntries });
};

export { useTimelineMenu };
