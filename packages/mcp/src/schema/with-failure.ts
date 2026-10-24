/* @layer core @kind logic */
import { z } from 'zod';
import { FAILURE_SCHEMA } from './failure.constants';

const withFailure = (shape: z.ZodRawShape) =>
  z.xor([z.strictObject({ ok: z.literal(true), ...shape }), FAILURE_SCHEMA]);

export { withFailure };
