/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { AxisArgs } from '../context-menu/menu-args.type';
import { addGuideHere } from '../guides/add-guide-here';
import { clearGuides } from '../guides/clear-guides';
import { COMMAND_GROUP } from './keymap.constants';
import { editorCommand } from './editor-command';
import { pixelCommand } from './pixel-command';

const group = COMMAND_GROUP.view;

const GUIDE_MENU_COMMANDS: readonly CommandDef[] = [
  { id: 'guide.add_here', label: 'Add a guide at a position', group, run: (context?: CommandContext) => addGuideHere(commandArgs<AxisArgs>(context)) },
  { id: 'guide.clear', label: 'Clear guides', group, run: () => clearGuides() },
]
  .map(pixelCommand)
  .map(editorCommand);

export { GUIDE_MENU_COMMANDS };
