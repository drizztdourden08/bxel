/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { ZoomArgs } from '../context-menu/menu-args.type';
import { copyCursor } from '../editor/copy-cursor';
import { zoomTo } from '../editor/zoom-to';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP } from './keymap.constants';

const STATUS_MENU_COMMANDS: readonly CommandDef[] = [
  { id: 'status.copy_cursor', label: 'Copy the cursor position', group: COMMAND_GROUP.view, run: () => void copyCursor() },
  {
    id: 'view.zoom_to',
    label: 'Zoom to a percent',
    group: COMMAND_GROUP.view,
    run: (context?: CommandContext) => {
      const { percent } = commandArgs<ZoomArgs>(context);
      if (percent !== undefined) zoomTo(percent);
    },
  },
].map(editorCommand);

export { STATUS_MENU_COMMANDS };
