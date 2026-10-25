/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { cycleRegion } from '../regions/cycle-region';
import { REGION_COMMAND, REGION_TEXT } from '../regions/regions.constants';
import { COMMAND_GROUP } from './keymap.constants';

const REGION_COMMANDS: readonly CommandDef[] = [
  { id: REGION_COMMAND.next, label: REGION_TEXT.next, group: COMMAND_GROUP.view, chord: 'F6', run: () => cycleRegion(1) },
  { id: REGION_COMMAND.previous, label: REGION_TEXT.previous, group: COMMAND_GROUP.view, chord: 'Shift+F6', run: () => cycleRegion(-1) },
];

export { REGION_COMMANDS };
