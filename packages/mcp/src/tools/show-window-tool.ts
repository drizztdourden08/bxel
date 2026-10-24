/* @layer core @kind logic */
import { z } from 'zod';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { NO_INPUT_SCHEMA, WINDOW_SCHEMA } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const showWindowTool = defineTool(TOOL_NAME.showWindow, {
  title: 'Show the Bxel window',
  description:
    'Shows the editor window of a headless Bxel without taking focus. The instance then stays open until the owner closes it. On a visible instance it does nothing.',
  input: NO_INPUT_SCHEMA,
  output: withFailure({ shown: z.boolean(), window: WINDOW_SCHEMA }),
});

export { showWindowTool };
