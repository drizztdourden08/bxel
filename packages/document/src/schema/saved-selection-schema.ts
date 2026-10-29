/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SPRITE_SIZE } from '../model/limits.constants';
import { nameSchema } from './name-schema';

const coordinate = z.number().int().min(0).max(MAX_SPRITE_SIZE);
const side = z.number().int().min(1).max(MAX_SPRITE_SIZE);

const savedSelectionSchema = z.strictObject({
  name: nameSchema,
  width: side,
  height: side,
  runs: z.array(z.tuple([coordinate, coordinate, coordinate])).max(MAX_SPRITE_SIZE * MAX_SPRITE_SIZE),
});

export { savedSelectionSchema };
