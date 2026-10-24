/* @layer renderer-app @kind constants */
import { shortcutsHelp } from '@drizztdourden08/brock-react';
import type { CommandDef } from '@drizztdourden08/brock-react';
import { COMMAND_GROUP, COMMAND_ID, EDITOR_SCOPE } from './keymap.constants';

const HELP_COMMANDS: readonly CommandDef[] = [
  {
    id: COMMAND_ID.shortcuts,
    label: 'Keyboard shortcuts',
    group: COMMAND_GROUP.help,
    chord: 'F1',
    scope: EDITOR_SCOPE,
    run: shortcutsHelp.open,
  },
];

export { HELP_COMMANDS };
