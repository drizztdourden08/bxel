/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { UnitArgs } from '../context-menu/menu-args.type';
import { unitOf } from '../ruler/unit-of';
import { useRulerUnitStore } from '../stores/useRulerUnitStore';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';

const RULER_UNIT_COMMANDS: readonly CommandDef[] = [
  {
    id: 'ruler.set_unit',
    label: 'Set the unit of the rulers',
    group: COMMAND_GROUP.view,
    run: (context?: CommandContext) => useRulerUnitStore.getState().choose(unitOf(commandArgs<UnitArgs>(context).unit)),
  },
].map(ruled);

export { RULER_UNIT_COMMANDS };
