/* @layer core @kind logic */
import { z } from 'zod';
import { OPTION_VALUES_SCHEMA, PRESET_ROW_SCHEMA } from '../schema/tool-options.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { PRESET_ID, PRESET_NAME } from './preset-tools.constants';
import { TOOL_NAME } from './tool-name.constants';

const updatePresetTool = defineTool(TOOL_NAME.updatePreset, {
  title: 'Update a tool preset',
  description: 'Renames a preset of the owner\'s own, or replaces its fields. Built in presets cannot be changed; save a copy instead.',
  input: z.strictObject({ id: PRESET_ID, name: PRESET_NAME.optional(), fields: OPTION_VALUES_SCHEMA.optional().describe('Replaces all the fields of the preset.') }),
  output: withFailure({ preset: PRESET_ROW_SCHEMA }),
});

export { updatePresetTool };
