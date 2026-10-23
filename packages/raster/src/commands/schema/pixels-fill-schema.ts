/* @layer core @kind logic */
import { z } from 'zod';
import { indexSchema } from './index-schema';
import { maskSchema } from './mask-schema';

const pixelsFillSchema = z.strictObject({
  x: z.number().int(),
  y: z.number().int(),
  index: indexSchema,
  mode: z.enum(['contiguous', 'global']).default('contiguous'),
  connectivity: z.union([z.literal(4), z.literal(8)]).default(4),
  mask: maskSchema,
});

export { pixelsFillSchema };
