/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { FILE_COMMANDS } from '../files/file-commands.constants';
import { BRUSH_COMMANDS } from './brush-commands.constants';
import { COLLISION_COMMANDS } from './collision-commands.constants';
import { CONFIG_COMMANDS } from './config-commands.constants';
import { CANVAS_SIZE_COMMANDS } from './canvas-size-commands.constants';
import { DIALOG_COMMANDS } from './dialog-commands.constants';
import { EDIT_COMMANDS } from './edit-commands.constants';
import { HELP_COMMANDS } from './help-commands.constants';
import { PROJECT_COMMANDS } from './project-commands.constants';
import { SELECTION_COMMANDS } from './selection-commands.constants';
import { SHEET_EDITOR_COMMANDS } from './sheet-commands.constants';
import { TERRAIN_COMMANDS } from './terrain-commands.constants';
import { TILED_COMMANDS } from './tiled-commands.constants';
import { TILEMAP_COMMANDS } from './tilemap-commands.constants';
import { TIMELINE_COMMANDS } from './timeline-commands.constants';
import { TOOL_COMMANDS } from './tool-commands.constants';
import { VIEW_COMMANDS } from './view-commands.constants';

const EDITOR_COMMANDS: readonly CommandDef[] = [
  ...TOOL_COMMANDS,
  ...BRUSH_COMMANDS,
  ...VIEW_COMMANDS,
  ...EDIT_COMMANDS,
  ...SELECTION_COMMANDS,
  ...CANVAS_SIZE_COMMANDS,
  ...SHEET_EDITOR_COMMANDS,
  ...TILEMAP_COMMANDS,
  ...COLLISION_COMMANDS,
  ...TERRAIN_COMMANDS,
  ...TIMELINE_COMMANDS,
  ...HELP_COMMANDS,
];

const APP_COMMANDS: readonly CommandDef[] = [...FILE_COMMANDS, ...CONFIG_COMMANDS, ...PROJECT_COMMANDS, ...DIALOG_COMMANDS, ...TILED_COMMANDS, ...EDITOR_COMMANDS];

export { APP_COMMANDS };
