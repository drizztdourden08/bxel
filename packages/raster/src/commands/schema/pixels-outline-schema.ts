/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { indexSchema } from './index-schema';
import { requiredMaskSchema } from './required-mask-schema';

const pixelsOutlineSchema = z.strictObject({
  mask: requiredMaskSchema,
  side: z.enum(['inside', 'outside']).default('inside').describe('Which side of the selection edge the one pixel line is drawn on.'),
  connectivity: z.union([z.literal(4), z.literal(8)]).default(4).describe('4 draws a thin line, 8 draws a line that also covers the corners.'),
  index: indexSchema.describe('The palette index of the line.'),
  allUses: allUsesSchema,
});

export { pixelsOutlineSchema };
