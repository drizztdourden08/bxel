/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const swatchDeleteSchema = z.strictObject({
  bankId: idSchema('bnk'),
  swatchId: idSchema('sw'),
  replacementId: idSchema('sw').optional(),
});

export { swatchDeleteSchema };
