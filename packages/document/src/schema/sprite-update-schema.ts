/* @layer core @kind logic */
import { z } from 'zod';
import { pivotSchema } from './pivot-schema';
import { pixelGridSchema } from './pixel-grid-schema';
import { platformIdSchema } from './platform-id-schema';

const spriteUpdateSchema = z.strictObject({
  name: z.string().optional(),
  pivot: pivotSchema.optional(),
  platformId: platformIdSchema.nullable().optional(),
  platformStrict: z.boolean().optional(),
  pixelGrid: pixelGridSchema.nullable().optional(),
});

export { spriteUpdateSchema };
