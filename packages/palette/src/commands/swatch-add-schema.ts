/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const swatchAddSchema = z.strictObject({
  bankId: idSchema('bnk'),
  rgb: z.string(),
  name: z.string().optional(),
});

export { swatchAddSchema };
