/* @layer core @kind logic */
import { z } from 'zod';
import { DOCUMENT_ID_SCHEMA } from '../schema/ids.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const stopBxelTool = defineTool(TOOL_NAME.stopBxel, {
  title: 'Stop Bxel',
  description:
    'Ends a headless Bxel that this session started. With unsaved changes it refuses, unless unsaved is "recover" (keep the work in the recovery journal) or "discard" (edit mode only).',
  input: z.strictObject({
    unsaved: z.enum(['refuse', 'recover', 'discard']).default('refuse').describe('discard needs edit mode.'),
  }),
  output: withFailure({
    stopped: z.boolean(),
    recovered: z.array(DOCUMENT_ID_SCHEMA),
    discarded: z.array(DOCUMENT_ID_SCHEMA),
  }),
});

export { stopBxelTool };
