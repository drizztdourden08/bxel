/* @layer core @kind logic */
import { z } from 'zod';
import { OPTION_VALUES_SCHEMA, PRESET_ROW_SCHEMA } from '../schema/tool-options.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { PRESET_NAME } from './preset-tools.constants';
import { TOOL_NAME } from './tool-name.constants';

const savePresetTool = defineTool(TOOL_NAME.savePreset, {
  title: 'Save a tool preset',
  description: 'Saves a new preset of the owner\'s own for one tool member. fields are option ids with the values to set, validated against the option model; list_tools gives the ids.',
  input: z.strictObject({
    member: z.string().min(1).max(100).describe('The tool member the preset picks, from list_tools.'),
    name: PRESET_NAME,
    fields: OPTION_VALUES_SCHEMA,
  }),
  output: withFailure({ preset: PRESET_ROW_SCHEMA }),
});

export { savePresetTool };
