/* @layer core @kind logic */
import { alphaSchema, idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const swatchAddSchema = z.strictObject({
  bankId: idSchema('bnk'),
  rgb: z.string(),
  alpha: alphaSchema.optional(),
  name: z.string().optional(),
});

export { swatchAddSchema };
