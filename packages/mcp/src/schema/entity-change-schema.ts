/* @layer core @kind logic */
import { z } from 'zod';

const entityChangeSchema = <T extends z.ZodType>(id: T) =>
  z.strictObject({ id, kind: z.enum(['added', 'removed', 'updated']) });

export { entityChangeSchema };
