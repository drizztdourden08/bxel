/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { TIMELINE_MENU } from '../TimelinePanel.menu.constants';

const noTags = (): ContextMenuEntry => ({ command: 'timeline.add_tag', label: TIMELINE_MENU.noTags, ...unless(false, TIMELINE_MENU.noTags) });

export { noTags };
