/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_PATTERN_SIDE } from '../model/limits.constants';
import { nameSchema } from './name-schema';
import { patternRefSchema } from './pattern-ref-schema';

const side = z.number().int().min(1).max(MAX_PATTERN_SIDE);

const patternUpdateSchema = z.strictObject({
  pattern: patternRefSchema,
  name: nameSchema.optional(),
  width: side.optional(),
  height: side.optional(),
  pixels: z.string().min(1).optional(),
});

export { patternUpdateSchema };
