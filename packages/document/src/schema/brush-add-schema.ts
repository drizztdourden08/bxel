/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_BRUSH_SIDE } from '../model/limits.constants';
import { nameSchema } from './name-schema';

const side = z.number().int().min(1).max(MAX_BRUSH_SIDE);

const brushAddSchema = z.strictObject({
  name: nameSchema,
  width: side,
  height: side,
  pixels: z.string().min(1),
});

export { brushAddSchema };
