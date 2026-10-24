/* @layer core @kind logic */
import { z } from 'zod';
import { durationSchema } from './duration-schema';
import { frameRefSchema } from './frame-ref-schema';

const frameAddSchema = z.strictObject({
  after: frameRefSchema.optional(),
  copyOf: frameRefSchema.optional(),
  durationMs: durationSchema.optional(),
  linked: z.boolean().default(false),
});

export { frameAddSchema };
