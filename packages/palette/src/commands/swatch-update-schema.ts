/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const swatchUpdateSchema = z.strictObject({
  bankId: idSchema('bnk'),
  swatchId: idSchema('sw'),
  rgb: z.string().optional(),
  name: z.string().optional(),
});

export { swatchUpdateSchema };
