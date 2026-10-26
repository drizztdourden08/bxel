/* @layer core @kind logic */
import { alphaSchema, idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const swatchUpdateSchema = z.strictObject({
  bankId: idSchema('bnk'),
  swatchId: idSchema('sw'),
  rgb: z.string().optional(),
  alpha: alphaSchema.optional(),
  name: z.string().optional(),
});

export { swatchUpdateSchema };
