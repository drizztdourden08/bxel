/* @layer core @kind logic */
import { z } from 'zod';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { PRESET_ID } from './preset-tools.constants';
import { TOOL_NAME } from './tool-name.constants';

const deletePresetTool = defineTool(TOOL_NAME.deletePreset, {
  title: 'Delete a tool preset',
  description: 'Deletes a preset of the owner\'s own. Built in presets cannot be deleted.',
  input: z.strictObject({ id: PRESET_ID }),
  output: withFailure({ deleted: z.string().describe('The id of the preset that was deleted.') }),
});

export { deletePresetTool };
