/* @layer core @kind logic */
import { z } from 'zod';
import { frameRefSchema } from './frame-ref-schema';

const frameReorderSchema = z.strictObject({
  frame: frameRefSchema,
  to: z.number().int().min(0),
});

export { frameReorderSchema };
