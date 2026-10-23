/* @layer core @kind logic */
import { z } from 'zod';
import { pivotSchema } from './pivot-schema';

const spriteUpdateSchema = z.strictObject({
  name: z.string().optional(),
  pivot: pivotSchema.optional(),
});

export { spriteUpdateSchema };
