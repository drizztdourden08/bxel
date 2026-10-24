/* @layer core @kind logic */
import { z } from 'zod';
import { durationSchema } from './duration-schema';
import { frameRefSchema } from './frame-ref-schema';

const frameUpdateSchema = z.strictObject({
  frame: frameRefSchema,
  durationMs: durationSchema,
});

export { frameUpdateSchema };
