/* @layer core @kind logic */
import { z } from 'zod';
import { idSchema } from './id-schema';

const projectUpdateSchema = z.strictObject({
  name: z.string().optional(),
  coverSpriteId: idSchema('spr').nullable().optional(),
});

export { projectUpdateSchema };
