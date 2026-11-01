/* @layer core @kind constants */
import { z } from 'zod';

const OPTION_VALUE_SCHEMA = z.union([z.number(), z.string().max(100), z.boolean()]);

const OPTION_VALUES_SCHEMA = z
  .record(z.string().min(1).max(100), OPTION_VALUE_SCHEMA)
  .describe('Option values by option id, such as {"pencil.size": 3, "pencil.tip": "circle"}. list_tools gives the ids, kinds, ranges and choices; a value outside them is refused and the error names the option.');

const SURFACE_VALUES = ['sprite', 'tile', 'map', 'sheet'] as const;

const OPTION_ROW_SCHEMA = z.strictObject({
  id: z.string().describe('The option id to use in options and in presets.'),
  tool: z.string(),
  label: z.string(),
  description: z.string(),
  kind: z.enum(['number', 'choice', 'toggle', 'action']),
  tier: z.union([z.literal(1), z.literal(2)]).describe('1 is always shown on the options bar; 2 sits in the more panel.'),
  group: z.string(),
  memory: z.enum(['tool', 'global']).describe('tool: each tool keeps its own value. global: shared by the tools that show it.'),
  default: OPTION_VALUE_SCHEMA,
  min: z.number().nullable(),
  max: z.number().nullable(),
  choices: z.array(z.strictObject({ value: z.string(), label: z.string(), description: z.string() })).nullable(),
  command: z.string().nullable().describe('The command that sets or cycles it, when there is one.'),
  value: OPTION_VALUE_SCHEMA.nullable().describe('The value now, or null for an action.'),
  applies: z.boolean().describe('False while another option makes this one irrelevant.'),
  disabled: z.string().nullable().describe('Why it cannot be changed right now, or null.'),
});

const PRESET_ROW_SCHEMA = z.strictObject({
  id: z.string(),
  name: z.string(),
  member: z.string().describe('The tool member the preset picks, from list_tools.'),
  builtin: z.boolean().describe('Built in presets cannot be changed or deleted.'),
  fields: OPTION_VALUES_SCHEMA,
  summary: z.string(),
  active: z.boolean().describe('The options now equal this preset.'),
});

export { OPTION_ROW_SCHEMA, OPTION_VALUE_SCHEMA, OPTION_VALUES_SCHEMA, PRESET_ROW_SCHEMA, SURFACE_VALUES };
