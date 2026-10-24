/* @layer core @kind logic */
import { z } from 'zod';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { LAUNCHED_BY_SCHEMA, WINDOW_SCHEMA } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const startBxelTool = defineTool(TOOL_NAME.startBxel, {
  title: 'Start Bxel',
  description:
    'Starts Bxel when it is not running, with no window (headless) or with a window (visible). Needs no session. When Bxel already runs it starts nothing; "visible" then shows a headless instance.',
  input: z.strictObject({ window: WINDOW_SCHEMA }),
  output: withFailure({
    started: z.boolean(),
    window: WINDOW_SCHEMA,
    launchedBy: LAUNCHED_BY_SCHEMA,
    readyMs: z.number().int().min(0),
  }),
});

export { startBxelTool };
