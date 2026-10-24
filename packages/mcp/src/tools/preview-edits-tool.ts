/* @layer core @kind logic */
import { z } from 'zod';
import { PREVIEW_PIXELS_DEFAULT, PREVIEW_PIXELS_MAX } from '../limits/limits.constants';
import { editBaseShape } from '../schema/edit-base-shape';
import type { StepCommand } from '../schema/step-command.type';
import { TRANSACTION_SHAPE } from '../schema/transaction-output.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const buildPreviewEditsTool = (commands: readonly StepCommand[]) =>
  defineTool(TOOL_NAME.previewEdits, {
    title: 'Preview edits',
    description:
      'Runs a batch of edit steps on a draft and reports what would change, without changing the document. The input is the same as apply_edits, and the same input at the same revision gives the same changes.',
    input: z.strictObject({
      ...editBaseShape(commands),
      previewPixels: z
        .number()
        .int()
        .min(0)
        .max(PREVIEW_PIXELS_MAX)
        .default(PREVIEW_PIXELS_DEFAULT)
        .describe('Changed pixels returned, summed over all cels.'),
      render: z
        .strictObject({ scale: z.number().int().min(1).max(8).default(4) })
        .optional()
        .describe('Adds one PNG per changed sprite frame, at most 4, drawn from the draft.'),
    }),
    output: withFailure(TRANSACTION_SHAPE),
  });

export { buildPreviewEditsTool };
