/* @layer core @kind logic */
import { z } from 'zod';
import { animSourceSchema } from './anim-source-schema';
import { pivotSchema } from './pivot-schema';

const animationCreateSchema = z.strictObject({
  name: z.string(),
  source: animSourceSchema,
  anchor: pivotSchema.optional(),
});

export { animationCreateSchema };
