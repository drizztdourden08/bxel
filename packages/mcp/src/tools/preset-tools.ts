/* @layer core @kind logic */
import { z } from 'zod';
import { OPTION_VALUES_SCHEMA, PRESET_ROW_SCHEMA } from '../schema/tool-options.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const PRESET_ID = z.string().min(1).max(200).describe('A preset id from list_presets, such as builtin.pencil-2.');

const PRESET_NAME = z.string().min(1).max(60);

const listPresetsTool = defineTool(TOOL_NAME.listPresets, {
  title: 'List tool presets',
  description: 'Lists the tool presets: the built in ones and the owner\'s own. Each has the member it picks and the option values it sets. active marks the one the options equal now.',
  input: z.strictObject({ member: z.string().min(1).max(100).optional().describe('Only the presets of one tool member from list_tools.') }),
  output: withFailure({ presets: z.array(PRESET_ROW_SCHEMA) }),
});

const applyPresetTool = defineTool(TOOL_NAME.applyPreset, {
  title: 'Apply a tool preset',
  description: 'Picks the tool of a preset and sets its options, as if the owner chose it in the tool flyout. Refused while the owner is drawing or holds a borrowed tool.',
  input: z.strictObject({ id: PRESET_ID }),
  output: withFailure({ preset: PRESET_ROW_SCHEMA }),
});

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

const updatePresetTool = defineTool(TOOL_NAME.updatePreset, {
  title: 'Update a tool preset',
  description: 'Renames a preset of the owner\'s own, or replaces its fields. Built in presets cannot be changed; save a copy instead.',
  input: z.strictObject({ id: PRESET_ID, name: PRESET_NAME.optional(), fields: OPTION_VALUES_SCHEMA.optional().describe('Replaces all the fields of the preset.') }),
  output: withFailure({ preset: PRESET_ROW_SCHEMA }),
});

const deletePresetTool = defineTool(TOOL_NAME.deletePreset, {
  title: 'Delete a tool preset',
  description: 'Deletes a preset of the owner\'s own. Built in presets cannot be deleted.',
  input: z.strictObject({ id: PRESET_ID }),
  output: withFailure({ deleted: z.string().describe('The id of the preset that was deleted.') }),
});

export { applyPresetTool, deletePresetTool, listPresetsTool, savePresetTool, updatePresetTool };
