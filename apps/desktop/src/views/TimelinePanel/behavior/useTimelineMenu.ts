/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { currentTarget } from '../../../editor/current-target';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { currentSelection } from '../../../timeline/current-selection';
import { TIMELINE_MENU } from '../TimelinePanel.constants';
import { pickTimelineTarget } from './pick-timeline-target';
import { timelineClicked } from './timeline-clicked';
import { timelineMenuEntries } from './timeline-menu-entries';

const pickClicked = (context: ContextMenuContext): void => {
  const target = currentTarget();
  if (target) pickTimelineTarget(timelineClicked(context, target.sprite), currentSelection(target));
};

const useTimelineMenu = (): void => {
  useContextMenu(COMMAND_ZONE.timeline, { label: TIMELINE_MENU.label, beforeOpen: pickClicked, entries: timelineMenuEntries });
};

export { useTimelineMenu };
