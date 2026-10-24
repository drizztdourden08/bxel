/* @layer core @kind logic */
import { z } from 'zod';
import { maskSchema } from './mask-schema';
import { patchSchema } from './patch-schema';
import { pointSchema } from './point-schema';

const pixelsStampSchema = z.strictObject({
  patch: patchSchema,
  points: z.array(pointSchema).min(1),
  anchor: pointSchema.optional(),
  skipZero: z.boolean().default(true),
  mask: maskSchema,
});

export { pixelsStampSchema };
