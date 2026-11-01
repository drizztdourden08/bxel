/* @layer core @kind logic */
import { z } from 'zod';
import { PREVIEW_PIXELS_DEFAULT, PREVIEW_PIXELS_MAX } from '../limits/limits.constants';
import { FAILURE_SCHEMA } from '../schema/failure.constants';
import { editBaseShape } from '../schema/edit-base-shape';
import { PLAN_INPUT_SCHEMA, PLAN_RESULT_SCHEMA } from '../schema/sprite-plan.constants';
import type { StepCommand } from '../schema/step-command.type';
import { TRANSACTION_SHAPE } from '../schema/transaction-output.constants';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const buildPreviewEditsTool = (commands: readonly StepCommand[]) => {
  const base = editBaseShape(commands);
  return defineTool(TOOL_NAME.previewEdits, {
    title: 'Preview edits',
    description:
      'Runs a batch of edit steps on a draft and reports what would change, without changing the document. The input is the same as apply_edits, and the same input at the same revision gives the same changes. Instead of steps, give a plan to read the names and rectangles a sprite command would make: rename and folder give the new names of the sprites, slice gives the names and rectangles of the pieces, strip gives the cells of a strip and the cut the sprite looks made for. A plan changes nothing and needs no baseRevision or label.',
    input: z
      .strictObject({
        documentId: base.documentId,
        baseRevision: base.baseRevision.optional(),
        label: base.label.optional(),
        steps: base.steps.optional(),
        plan: PLAN_INPUT_SCHEMA.optional(),
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
      })
      .refine((input) => (input.plan === undefined) !== (input.steps === undefined), { message: 'Give steps or a plan, not both.', path: ['steps'] })
      .refine((input) => input.steps === undefined || (input.baseRevision !== undefined && input.label !== undefined), {
        message: 'Steps need a baseRevision and a label.',
        path: ['baseRevision'],
      }),
    output: z.xor([
      z.strictObject({ ok: z.literal(true), ...TRANSACTION_SHAPE }),
      z.strictObject({ ok: z.literal(true), mode: z.literal('plan'), plan: PLAN_RESULT_SCHEMA }),
      FAILURE_SCHEMA,
    ]),
  });
};

export { buildPreviewEditsTool };
