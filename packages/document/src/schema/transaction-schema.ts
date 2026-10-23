/* @layer core @kind logic */
import { z } from 'zod';
import { idSchema } from './id-schema';
import { targetScopeSchema } from './scope-schema';

const stepSchema = z.strictObject({
  name: z.string().min(1),
  targets: targetScopeSchema.nullable(),
  options: z.unknown().optional(),
  ref: z.string().min(1).optional(),
});

const transactionRequestSchema = z.strictObject({
  documentId: idSchema('doc'),
  baseRevision: z.number().int().min(0),
  mode: z.enum(['preview', 'commit']),
  origin: z.enum(['ui', 'mcp']),
  label: z.string().min(1).max(200),
  steps: z.array(stepSchema),
  previewPixels: z.number().int().min(0),
});

export { transactionRequestSchema };
