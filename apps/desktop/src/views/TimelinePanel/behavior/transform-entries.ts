/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { TIMELINE_MENU } from '../TimelinePanel.constants';

const transformEntries = (): ContextMenuEntry => ({
  label: TIMELINE_MENU.transform,
  items: [
    { command: 'timeline.new_direction_set', label: TIMELINE_MENU.directionSet },
    { command: 'timeline.make_spritesheet', label: TIMELINE_MENU.spritesheet },
    { command: 'timeline.split_to_sprites', label: TIMELINE_MENU.splitToSprites },
    { command: 'timeline.export_frames', label: TIMELINE_MENU.exportFrames },
  ],
});

export { transformEntries };
