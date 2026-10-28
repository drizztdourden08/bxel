/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { TIMELINE_MENU } from '../TimelinePanel.constants';
import { pickTimelineTarget } from './pick-timeline-target';
import { timelineMenuEntries } from './timeline-menu-entries';
import { ruledEntries } from '../../../context-menu/ruled-entries';

const useTimelineMenu = (): void => {
  useContextMenu(COMMAND_ZONE.timeline, { label: TIMELINE_MENU.label, beforeOpen: pickTimelineTarget, entries: ruledEntries(timelineMenuEntries) });
};

export { useTimelineMenu };
