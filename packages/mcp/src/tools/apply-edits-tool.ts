/* @layer core @kind logic */
import { z } from 'zod';
import { editBaseShape } from '../schema/edit-base-shape';
import type { StepCommand } from '../schema/step-command.type';
import { TRANSACTION_SHAPE } from '../schema/transaction-output.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const buildApplyEditsTool = (commands: readonly StepCommand[]) =>
  defineTool(TOOL_NAME.applyEdits, {
    title: 'Apply edits',
    description:
      'Commits a batch of edit steps as one undo step at baseRevision. The whole batch lands or none of it does. A stale baseRevision fails with STALE_REVISION; read again and retry.',
    input: z.strictObject({
      ...editBaseShape(commands),
      clientRequestId: z
        .string()
        .regex(/^[A-Za-z0-9_-]{1,64}$/)
        .optional()
        .describe('A repeat with the same id in the same session returns the first result and commits nothing.'),
    }),
    output: withFailure(TRANSACTION_SHAPE),
  });

export { buildApplyEditsTool };
