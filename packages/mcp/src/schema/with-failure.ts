/* @layer core @kind logic */
import { z } from 'zod';
import { FAILURE_SCHEMA } from './failure.constants';

const withFailure = <S extends z.ZodRawShape>(shape: S) =>
  z.xor([z.strictObject({ ok: z.literal(true), ...shape }), FAILURE_SCHEMA]);

export { withFailure };
