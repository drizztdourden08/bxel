/* @layer core @kind constants */
import { z } from 'zod';
import { RETRY_VALUES } from '../errors/retry.constants';
import { FRAME_ID_SCHEMA, LAYER_ID_SCHEMA, REVISION_SCHEMA, SPRITE_ID_SCHEMA } from './ids.constants';

const TARGET_ISSUE_SCHEMA = z
  .strictObject({
    spriteId: SPRITE_ID_SCHEMA,
    layerId: LAYER_ID_SCHEMA.nullable(),
    frameId: FRAME_ID_SCHEMA.nullable(),
    reason: z.string(),
  })
  .meta({ id: 'TargetIssue' });

const SINCE_SCHEMA = z.strictObject({
  revision: z.number().int(),
  label: z.string(),
  origin: z.enum(['ui', 'mcp']),
});

const FAILURE_SCHEMA = z
  .strictObject({
    ok: z.literal(false),
    error: z.strictObject({
      code: z.string(),
      message: z.string(),
      step: z.number().int().nullable(),
      path: z.string().nullable(),
      details: z.array(TARGET_ISSUE_SCHEMA).max(64),
      retry: z.enum(RETRY_VALUES),
      currentRevision: REVISION_SCHEMA.optional(),
      since: z.array(SINCE_SCHEMA).max(20).optional(),
    }),
  })
  .meta({ id: 'Failure' });

export { FAILURE_SCHEMA, TARGET_ISSUE_SCHEMA };
