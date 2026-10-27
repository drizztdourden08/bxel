/* @layer core @kind logic */
import { z } from 'zod';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const EFFECT_VALUES = ['show', 'edit', 'file', 'app'] as const;

const COMMAND_ROW_SCHEMA = z.strictObject({
  id: z.string(),
  label: z.string(),
  group: z.string().nullable(),
  area: z.string().describe('The bundle the command belongs to, such as edit_pixels or app_control.'),
  chord: z.string().nullable(),
  enabled: z.boolean(),
  reason: z.string().nullable().describe('Why the command is off right now, or null.'),
  checkable: z.boolean(),
  checked: z.boolean().nullable(),
  effect: z.enum(EFFECT_VALUES).describe('show changes only what is shown; edit changes a document; file touches files; app changes the app.'),
  args: z.record(z.string(), z.unknown()).nullable().describe('JSON Schema of the args run_command takes, or null.'),
  opensDialog: z.boolean().describe('The owner sees a dialog or a pending preview for it. Pass show: true to run_command to open it.'),
});

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

export { COMMAND_ROW_SCHEMA, EFFECT_VALUES, listCommandsTool };
