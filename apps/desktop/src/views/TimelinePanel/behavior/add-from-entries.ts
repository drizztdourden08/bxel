/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { TIMELINE_MENU } from '../TimelinePanel.constants';

const addFromEntries = (): ContextMenuEntry => ({
  label: TIMELINE_MENU.addFrom,
  items: [
    { command: 'timeline.add_from_sprites', label: TIMELINE_MENU.fromSprites },
    { command: 'timeline.add_from_strip', label: TIMELINE_MENU.fromStrip },
    { command: 'timeline.add_from_sheet', label: TIMELINE_MENU.fromSheet },
  ],
});

export { addFromEntries };
