/* @layer core @kind constants */
import { z } from 'zod';

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

export { COMMAND_ROW_SCHEMA };
