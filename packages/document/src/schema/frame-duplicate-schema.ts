/* @layer core @kind logic */
import { z } from 'zod';
import { durationSchema } from './duration-schema';
import { frameRefSchema } from './frame-ref-schema';

const frameDuplicateSchema = z.strictObject({
  frame: frameRefSchema,
  durationMs: durationSchema.optional(),
  linked: z.boolean().default(false),
});

export { frameDuplicateSchema };
