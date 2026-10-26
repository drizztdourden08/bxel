/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { AxisArgs } from '../context-menu/menu-args.type';
import { centreMirrorAxis, placeMirrorAxis, removeMirrorAxis } from '../editor/mirror-axis';
import { COMMAND_GROUP } from './keymap.constants';
import { pixelCommand } from './pixel-command';
import { editorCommand } from './editor-command';

const group = COMMAND_GROUP.brush;

const SYMMETRY_MENU_COMMANDS: readonly CommandDef[] = [
  { id: 'symmetry.axis_here', label: 'Put a mirror axis at a position', group, run: (context?: CommandContext) => placeMirrorAxis(commandArgs<AxisArgs>(context)) },
  { id: 'symmetry.axis_centre', label: 'Centre the mirror axes', group, run: (context?: CommandContext) => centreMirrorAxis(commandArgs<AxisArgs>(context)) },
  { id: 'symmetry.axis_remove', label: 'Remove a mirror axis', group, run: (context?: CommandContext) => removeMirrorAxis(commandArgs<AxisArgs>(context)) },
]
  .map(pixelCommand)
  .map(editorCommand);

export { SYMMETRY_MENU_COMMANDS };
