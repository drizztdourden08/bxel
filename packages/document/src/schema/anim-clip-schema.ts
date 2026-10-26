/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SPRITE_SIZE } from '../model/limits.constants';
import { pointSchema } from './point-schema';

const animClipSchema = pointSchema.extend({
  width: z.number().int().min(1).max(MAX_SPRITE_SIZE),
  height: z.number().int().min(1).max(MAX_SPRITE_SIZE),
});

export { animClipSchema };
