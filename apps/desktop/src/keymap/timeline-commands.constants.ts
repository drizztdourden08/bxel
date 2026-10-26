/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { deleteFrames } from '../timeline/delete-frames';
import { COMMAND_ZONE } from './command-zone.constants';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP } from './keymap.constants';

const TIMELINE_COMMANDS: readonly CommandDef[] = [
  {
    id: 'timeline.delete',
    label: 'Delete the picked frames',
    group: COMMAND_GROUP.timeline,
    chord: 'Delete',
    zone: COMMAND_ZONE.timeline,
    whileTyping: false,
    run: deleteFrames,
  },
].map(editorCommand);

export { TIMELINE_COMMANDS };
