/* @layer core @kind logic */
import { z } from 'zod';
import { buildStepsSchema } from './build-steps-schema';
import { DOCUMENT_ID_SCHEMA, REVISION_SCHEMA } from './ids.constants';
import type { StepCommand } from './step-command.type';

const editBaseShape = (commands: readonly StepCommand[]) => ({
  documentId: DOCUMENT_ID_SCHEMA,
  baseRevision: REVISION_SCHEMA,
  label: z.string().min(1).max(200),
  steps: buildStepsSchema(commands),
});

export { editBaseShape };
