/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_PATTERN_SIDE } from '../model/limits.constants';
import { nameSchema } from './name-schema';

const side = z.number().int().min(1).max(MAX_PATTERN_SIDE);

const patternAddSchema = z.strictObject({
  name: nameSchema,
  width: side,
  height: side,
  pixels: z.string().min(1),
});

export { patternAddSchema };
