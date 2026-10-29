/* @layer core @kind logic */
import { z } from 'zod';
import { allUsesSchema } from './all-uses-schema';
import { indexSchema } from './index-schema';
import { maskSchema } from './mask-schema';
import { wrapSchema } from './wrap-schema';

const pixelsOutlineSchema = z.strictObject({
  side: z.enum(['outside', 'inside']).default('outside'),
  ring: z.union([z.literal(4), z.literal(8)]).default(8),
  of: z.enum(['art', 'selection']).default('art').describe('art outlines the painted pixels. selection draws the edge of the mask itself, which needs a mask and an index.'),
  index: indexSchema.optional(),
  selOut: z.boolean().default(false),
  mask: maskSchema,
  wrap: wrapSchema,
  allUses: allUsesSchema,
});

export { pixelsOutlineSchema };
