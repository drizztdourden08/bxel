/* @layer core @kind logic */
import { z } from 'zod';
import { idSchema } from './id-schema';
import { pivotSchema } from './pivot-schema';

const spriteCreateSchema = z.strictObject({
  name: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  bankId: idSchema('bnk').optional(),
  pivot: pivotSchema.optional(),
});

export { spriteCreateSchema };
