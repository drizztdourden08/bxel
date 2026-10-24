/* @layer core @kind logic */
import { z } from 'zod';
import { frameRefSchema } from './frame-ref-schema';

const frameDeleteSchema = z.strictObject({
  frame: frameRefSchema,
});

export { frameDeleteSchema };
