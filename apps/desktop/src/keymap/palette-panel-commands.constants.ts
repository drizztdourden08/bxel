/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { SwatchArgs } from '../context-menu/menu-args.type';
import { PANEL_COMMAND, PANEL_COMMAND_LABEL } from '../palette-panel/palette-panel.constants';
import type { PanelCommand } from '../palette-panel/palette-panel.type';
import { runPanelCommand } from '../palette-panel/run-panel-command';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP } from './keymap.constants';

const PALETTE_PANEL_COMMANDS: readonly CommandDef[] = (Object.keys(PANEL_COMMAND) as PanelCommand[]).map((key) =>
  editorCommand({
    id: PANEL_COMMAND[key],
    label: PANEL_COMMAND_LABEL[key],
    group: COMMAND_GROUP.colours,
    run: (context?: CommandContext) => runPanelCommand(key, commandArgs<SwatchArgs>(context).index),
  }),
);

export { PALETTE_PANEL_COMMANDS };
