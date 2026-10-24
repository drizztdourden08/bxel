/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { deleteInZone } from '../timeline/delete-in-zone';
import { COMMAND_ZONE } from './command-zone.constants';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP } from './keymap.constants';

const TIMELINE_COMMANDS: readonly CommandDef[] = [
  {
    id: 'timeline.delete',
    label: 'Clear the picked cels or delete the picked tag',
    group: COMMAND_GROUP.timeline,
    chord: 'Delete',
    zone: COMMAND_ZONE.timeline,
    whileTyping: false,
    run: deleteInZone,
  },
].map(editorCommand);

export { TIMELINE_COMMANDS };
