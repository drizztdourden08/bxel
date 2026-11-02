/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { patternFromSelection } from '../editor/pattern-from-selection';
import { COMMAND_GROUP } from './keymap.constants';
import { PATTERN_COMMAND } from './pattern-command-id.constants';
import { ruled } from './ruled';

const PATTERN_COMMANDS: readonly CommandDef[] = [
  {
    id: PATTERN_COMMAND.fromSelection,
    label: 'New dither pattern from selection',
    group: COMMAND_GROUP.brush,
    run: () => void patternFromSelection(),
  },
].map(ruled);

export { PATTERN_COMMANDS };
