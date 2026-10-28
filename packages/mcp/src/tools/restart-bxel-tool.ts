/* @layer core @kind logic */
import { z } from 'zod';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { WINDOW_SCHEMA } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const restartBxelTool = defineTool(TOOL_NAME.restartBxel, {
  title: 'Restart Bxel',
  description:
    'Restarts Bxel in the same window mode and reconnects this session with the same permissions. Only for a program the owner allowed to restart Bxel. With unsaved changes it refuses, unless unsaved is "recover", which keeps the work in the recovery journal for the owner. Open documents are not reopened; tabs come back as the owner left them.',
  input: z.strictObject({ unsaved: z.enum(['refuse', 'recover']).default('refuse') }),
  output: withFailure({
    restarted: z.boolean(),
    window: WINDOW_SCHEMA,
    sessionId: z.string().describe('The session after the restart.'),
    recovered: z.array(z.string()).describe('The documents kept for recovery.'),
  }),
});

export { restartBxelTool };
