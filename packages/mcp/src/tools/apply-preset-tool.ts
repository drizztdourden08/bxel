/* @layer core @kind logic */
import { z } from 'zod';
import { PRESET_ROW_SCHEMA } from '../schema/tool-options.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { PRESET_ID } from './preset-tools.constants';
import { TOOL_NAME } from './tool-name.constants';

const applyPresetTool = defineTool(TOOL_NAME.applyPreset, {
  title: 'Apply a tool preset',
  description: 'Picks the tool of a preset and sets its options, as if the owner chose it in the tool flyout. Refused while the owner is drawing or holds a borrowed tool.',
  input: z.strictObject({ id: PRESET_ID }),
  output: withFailure({ preset: PRESET_ROW_SCHEMA }),
});

export { applyPresetTool };
