/* @layer core @kind constants */
import { z } from 'zod';
import { CHANGE_SET_SCHEMA, PREVIEW_DATA_SCHEMA, WARNING_SCHEMA } from './changes.constants';
import { REVISION_SCHEMA } from './ids.constants';

const TRANSACTION_SHAPE = {
  mode: z.enum(['preview', 'commit']),
  baseRevision: REVISION_SCHEMA,
  revision: REVISION_SCHEMA,
  noop: z.boolean(),
  changes: CHANGE_SET_SCHEMA,
  created: z.record(z.string(), z.string()),
  report: z.record(z.string(), z.number()),
  warnings: z.array(WARNING_SCHEMA),
  preview: PREVIEW_DATA_SCHEMA.nullable(),
} satisfies z.ZodRawShape;

export { TRANSACTION_SHAPE };
