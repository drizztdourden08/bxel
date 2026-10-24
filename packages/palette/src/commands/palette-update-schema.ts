/* @layer core @kind logic */
import { idSchema } from '@bxel/document/schema';
import { z } from 'zod';

const paletteUpdateSchema = z.strictObject({
  bankId: idSchema('bnk'),
  name: z.string().optional(),
  transparent: z.boolean().optional(),
  replacementId: idSchema('sw').optional(),
  fillBackground: z.boolean().optional(),
});

export { paletteUpdateSchema };
