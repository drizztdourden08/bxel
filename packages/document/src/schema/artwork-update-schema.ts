/* @layer core @kind logic */
import { z } from 'zod';
import { idSchema } from './id-schema';
import { platformIdSchema } from './platform-id-schema';

const artworkUpdateSchema = z.strictObject({
  name: z.string().optional(),
  coverSpriteId: idSchema('spr').nullable().optional(),
  platformId: platformIdSchema.nullable().optional(),
});

export { artworkUpdateSchema };
