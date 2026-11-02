/* @layer core @kind logic */
import { z } from 'zod';
import { pivotSchema } from './pivot-schema';
import { rectSchema } from './rect-schema';
import { tagColourOptionSchema } from './tag-colour-option-schema';

const sliceAddSchema = z.strictObject({
  name: z.string(),
  rect: rectSchema,
  pivot: pivotSchema.nullable().optional(),
  center: rectSchema.nullable().optional(),
  colour: tagColourOptionSchema.optional(),
});

export { sliceAddSchema };
