/* @layer core @kind logic */
import { z } from 'zod';
import { COUNT_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { SCOPE_SETTINGS_SCHEMA } from '../scope/scope-settings.constants';
import { defineTool } from './define-tool';
import { LAUNCHED_BY_SCHEMA, NO_INPUT_SCHEMA, SESSION_MODE_SCHEMA, WINDOW_SCHEMA } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const getSessionTool = defineTool(TOOL_NAME.getSession, {
  title: 'Get the session',
  description:
    'Pairs on first use and reports the session, the Bxel instance, what the assistant can see and write, the command names and the limits. A good first call.',
  input: NO_INPUT_SCHEMA,
  output: withFailure({
    sessionId: z.string(),
    mode: SESSION_MODE_SCHEMA,
    client: z.strictObject({ name: z.string().nullable(), version: z.string().nullable() }),
    trust: z.enum(['prompted', 'this_launch', 'remembered', 'allow_all']),
    instance: z.strictObject({ window: WINDOW_SCHEMA, launchedBy: LAUNCHED_BY_SCHEMA, canStop: z.boolean() }),
    scope: SCOPE_SETTINGS_SCHEMA,
    bxelVersion: z.string(),
    contract: z.number().int().min(1),
    'aiFolder': z.string(),
    exportFormats: z.array(z.string()),
    commands: z.array(z.string()),
    limits: z.strictObject({
      steps: COUNT_SCHEMA,
      points: COUNT_SCHEMA,
      patchPixels: COUNT_SCHEMA,
      batchPatchPixels: COUNT_SCHEMA,
      readPixels: COUNT_SCHEMA,
      previewPixels: COUNT_SCHEMA,
      renderSide: COUNT_SCHEMA,
      targetSprites: COUNT_SCHEMA,
      listEntries: COUNT_SCHEMA,
    }),
  }),
});

export { getSessionTool };
