/* @layer core @kind logic */
import { z } from 'zod';
import { PRESET_ROW_SCHEMA } from '../schema/tool-options.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const listPresetsTool = defineTool(TOOL_NAME.listPresets, {
  title: 'List tool presets',
  description: 'Lists the tool presets: the built in ones and the owner\'s own. Each has the member it picks and the option values it sets. active marks the one the options equal now.',
  input: z.strictObject({ member: z.string().min(1).max(100).optional().describe('Only the presets of one tool member from list_tools.') }),
  output: withFailure({ presets: z.array(PRESET_ROW_SCHEMA) }),
});

export { listPresetsTool };
