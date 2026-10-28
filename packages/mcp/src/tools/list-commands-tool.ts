/* @layer core @kind logic */
import { z } from 'zod';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { COMMAND_ROW_SCHEMA } from './list-commands-tool.constants';
import { TOOL_NAME } from './tool-name.constants';

const listCommandsTool = defineTool(TOOL_NAME.listCommands, {
  title: 'List commands',
  description:
    'Lists the commands of the Bxel window, the same ones the menus, context menus and shortcuts run: id, label, area, shortcut, whether it is on right now and why not, its effect, and the args it takes. Commands of a turned off bundle are left out. Run one with run_command.',
  input: z.strictObject({
    area: z.string().min(1).max(64).optional().describe('Only the commands of one bundle, such as edit_pixels, animation or app_control.'),
    query: z.string().min(1).max(100).optional().describe('Only commands whose id or label contains this text.'),
    includeDisabled: z.boolean().default(true),
  }),
  output: withFailure({ commands: z.array(COMMAND_ROW_SCHEMA), total: z.number().int().min(0) }),
});

export { listCommandsTool };
