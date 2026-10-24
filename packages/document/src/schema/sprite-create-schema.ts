/* @layer core @kind logic */
import { z } from 'zod';
import { idSchema } from './id-schema';
import { pivotSchema } from './pivot-schema';
import { pixelGridSchema } from './pixel-grid-schema';

const spriteCreateSchema = z.strictObject({
  name: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  bankId: idSchema('bnk').optional(),
  pivot: pivotSchema.optional(),
  pixelGrid: pixelGridSchema.optional(),
});

export { spriteCreateSchema };
