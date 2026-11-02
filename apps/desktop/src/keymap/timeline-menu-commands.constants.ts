/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { ruled } from './ruled';
import { withMenuSelection } from './with-menu-selection';
import { TIMELINE_FRAME_COMMANDS } from './timeline-frame-commands.constants';
import { TIMELINE_TAG_COMMANDS } from './timeline-tag-commands.constants';

const TIMELINE_MENU_COMMANDS: readonly CommandDef[] = [...TIMELINE_FRAME_COMMANDS, ...TIMELINE_TAG_COMMANDS].map(withMenuSelection).map(ruled);

export { TIMELINE_MENU_COMMANDS };
