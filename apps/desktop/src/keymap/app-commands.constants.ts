/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { FILE_COMMANDS } from '../files/file-commands.constants';
import { BRUSH_COMMANDS } from './brush-commands.constants';
import { DIALOG_COMMANDS } from './dialog-commands.constants';
import { EDIT_COMMANDS } from './edit-commands.constants';
import { HELP_COMMANDS } from './help-commands.constants';
import { SELECTION_COMMANDS } from './selection-commands.constants';
import { SHEET_EDITOR_COMMANDS } from './sheet-commands.constants';
import { TOOL_COMMANDS } from './tool-commands.constants';
import { VIEW_COMMANDS } from './view-commands.constants';

const EDITOR_COMMANDS: readonly CommandDef[] = [
  ...TOOL_COMMANDS,
  ...BRUSH_COMMANDS,
  ...VIEW_COMMANDS,
  ...EDIT_COMMANDS,
  ...SELECTION_COMMANDS,
  ...SHEET_EDITOR_COMMANDS,
  ...HELP_COMMANDS,
];

const APP_COMMANDS: readonly CommandDef[] = [...FILE_COMMANDS, ...DIALOG_COMMANDS, ...EDITOR_COMMANDS];

export { APP_COMMANDS };
