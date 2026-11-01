/* @layer core @kind logic */
import { z } from 'zod';
import { OPTION_ROW_SCHEMA, PRESET_ROW_SCHEMA, SURFACE_VALUES } from '../schema/tool-options.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const listToolsTool = defineTool(TOOL_NAME.listTools, {
  title: 'List tools',
  description:
    'Lists the drawing tools of the tool rail for one surface (sprite, tile, map or sheet): each slot with its key, its members (the tools the flyout offers), and every option of the tool with its id, kind, range or choices, default, current value and whether it applies now. Also lists the presets. Use the option ids with set_view tool options and in save_preset, so no value is a guess.',
  input: z.strictObject({
    surface: z.enum(SURFACE_VALUES).optional().describe('The surface to list. Without it the surface of the open tab is used.'),
  }),
  output: withFailure({
    surface: z.enum(SURFACE_VALUES).describe('The surface listed.'),
    current: z.string().describe('The surface of the open tab, or none.'),
    surfaces: z.array(z.enum(SURFACE_VALUES)),
    slots: z.array(
      z.strictObject({
        id: z.string(),
        group: z.string(),
        label: z.string(),
        key: z.string(),
        tool: z.string(),
        surfaces: z.array(z.string()),
        active: z.boolean().describe('The tool of this slot is the tool in use.'),
        members: z.array(z.strictObject({ id: z.string(), label: z.string(), description: z.string(), variant: z.string().nullable() })),
        options: z.array(OPTION_ROW_SCHEMA),
      }),
    ),
    presets: z.array(PRESET_ROW_SCHEMA),
  }),
});

export { listToolsTool };
